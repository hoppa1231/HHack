import operator
from dataclasses import dataclass, field
from typing_extensions import Annotated

@dataclass(kw_only=True)
class SummaryState:
    news_title: str = field(default=None) # Report topic     
    search_query: str = field(default=None) # Search query
    search_query_en: str = field(default=None)
    web_research_results: Annotated[list, operator.add] = field(default_factory=list) 
    sources_gathered: Annotated[list, operator.add] = field(default_factory=list) 
    running_resume: str = field(default=None) # Final report

@dataclass(kw_only=True)
class SummaryStateInput:
    news_title: str = field(default=None) # Report topic
    running_resume: str = field(default=None) # Final report     

@dataclass(kw_only=True)
class SummaryStateOutput:
    running_resume: str = field(default=None) # Final report