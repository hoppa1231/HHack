import json
import os

from langgraph.graph import START, END, StateGraph
from langchain_core.messages import HumanMessage, SystemMessage
from datetime import datetime

from search.utils  import deduplicate_and_format_sources, format_sources, duckduckgo_search
from searcher_agent.state import SummaryState, SummaryStateInput, SummaryStateOutput
from lib.prompts import query_writer_instructions, summarizer_instructions
from langchain_gigachat import GigaChat

GIGACHAT_API_KEY = os.environ.get("GIGA_AUTH_KEY")
GIGA_SCOPE = os.environ.get("GIGA_SCOPE")
TIMEOUT = 180000

# Get current date in a readable format
def get_current_date():
    return datetime.now().strftime("%B %d, %Y")

import logging
logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
)

# Инициализация LLM
llm = GigaChat(
    credentials=GIGACHAT_API_KEY, 
    scope=GIGA_SCOPE,
    model="GigaChat-2", 
    verify_ssl_certs=False,
    temperature=0.1,
    timeout=TIMEOUT
)

# Nodes
def generate_query(state: SummaryState):
    """LangGraph node that generates a search query based on the research topic.
    
    Uses an LLM to create an optimized search query for web research based on
    the user's research topic. Supports both LMStudio and Ollama as LLM providers.
    
    Args:
        state: Current graph state containing the research topic
        config: Configuration for the runnable, including LLM provider settings
        
    Returns:
        Dictionary with state update, including search_query key containing the generated query
    """

    # Format the prompt
    current_date = get_current_date()
    formatted_prompt = query_writer_instructions.format(
        current_date=current_date,
        news_title=state.news_title
    )
    
    result = llm.invoke(
        [SystemMessage(content=formatted_prompt),
        HumanMessage(content=f"Generate a query for web search:")]
    )
    
    # Get the content
    content = result.content
    logger.info(f"Generated query content: {content}")

    # Parse the JSON response and get the query
    try:
        query = json.loads(content)
        search_query = query['query']
        search_query_en = query['en_query']
    except (json.JSONDecodeError, KeyError):
        # If parsing fails or the key is not found, use a fallback query
        search_query = content
    return {"search_query": search_query, 'search_query_en': search_query_en}

def web_research(state: SummaryState):
    """LangGraph node that performs web research using the generated search query.
    
    Executes a web search using the configured search API (tavily, perplexity, 
    duckduckgo, or searxng) and formats the results for further processing.
    
    Args:
        state: Current graph state containing the search query and research loop count
        config: Configuration for the runnable, including search API settings
        
    Returns:
        Dictionary with state update, including sources_gathered, research_loop_count, and web_research_results
    """

    # Configure

    # Search the web
    try:
        search_results = duckduckgo_search(state.search_query, state.search_query_en, max_results=5, fetch_full_page=True)
        search_str = deduplicate_and_format_sources(search_results, max_tokens_per_source=4096, fetch_full_page=True)
        logger.info(f"Successfully fetched web research results for query: {state.search_query}")
    except Exception as e:
        logger.error(f"Web search failed for query: {state.search_query} with error: {e}")
        return {"sources_gathered": state.sources_gathered, "web_research_results": state.web_research_results}
    return {"sources_gathered": [format_sources(search_results)], "web_research_results": [search_str]}

def summarize_sources(state: SummaryState):
    """LangGraph node that summarizes web research results.
    
    Uses an LLM to create or update a running summary based on the newest web research 
    results, integrating them with any existing summary.
    
    Args:
        state: Current graph state containing research topic, running summary,
              and web research results
        config: Configuration for the runnable, including LLM provider settings
        
    Returns:
        Dictionary with state update, including running_summary key containing the updated summary
    """

    # Existing summary
    existing_summary = state.running_resume

    # Most recent web research
    most_recent_web_research = state.web_research_results

    # Build the human message
    if existing_summary:
        human_message_content = (
            f"<Topic> \n {state.news_title} \n <Topic>"
            f"<Existing Article> \n {existing_summary} \n <Existing Article>\n\n"
            f"<New Context> \n {most_recent_web_research} \n <New Context>"
            f"Напиши лаконичное резюме, интегрируя новую информацию в уже существующую статью. Если существующей информации нет, то напиши текст из информации из источников. Будь внимателен, добавляй только релевантную информацию, относящуюся к теме. Если в источниках описывается не то событие/новость, не добавляй к исходной статье. В конце укажи 'Список источников'. \n"
        )
    
    result = llm.invoke(
        [SystemMessage(content=summarizer_instructions),
        HumanMessage(content=human_message_content)]
    )

    # Strip thinking tokens if configured
    running_summary = result.content

    return {"running_summary": running_summary}
        
builder = StateGraph(SummaryState, input=SummaryStateInput, output=SummaryStateOutput)
builder.add_node("generate_query", generate_query)
builder.add_node("web_research", web_research)
builder.add_node("summarize_sources", summarize_sources)

# Add edges
builder.add_edge(START, "generate_query")
builder.add_edge("generate_query", "web_research")
builder.add_edge("web_research", "summarize_sources")
builder.add_edge("summarize_sources", END)

graph = builder.compile()