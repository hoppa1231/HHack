import { useMemo, useState } from "react";
import { Home, Search, Bell, User, List } from "lucide-react";
import NewsDeck from "../../widgets/NewsDeck";
import NewsList from "../../widgets/NewsList";
import PeriodSwitch from "../../widgets/PeriodSwitch";
import type { News } from "../../entities/news/model";

const mock: News[] = [
  {
    id: "1",
    title: "Слили фотографии Александра Фалеева",
    summary: `Интернет взорвался: в сеть «утекли» редкие кадры Александра Фалеева, легендарного автора книг о силовых тренировках и, по совместительству, главного философа качалки.
По неподтверждённым данным, снимки были сделаны в естественной среде обитания Фалеева — возле турника и чашки кофе. На фото он выглядит сурово, но загадочно, как человек, который только что отказался от жима лёжа ради долгих рассуждений о смысле жизни.
Очевидцы утверждают, что на некоторых кадрах Александр якобы держит в руках гантелю весом 1 кг — «для разминки мозга». А на другом фото он задумчиво смотрит на пустой зал, где эхо повторяет его знаменитую фразу: «Не надо страдать — тренируйтесь в кайф».
Эксперты уже сравнили эту утечку с «фитнес-версией» сливов архивов NASA: ценность информации велика, но понять её смогут только те, кто хотя бы раз пробовал приседать по Фалееву.
В комментариях к фото поклонники пишут:
— «Он не потеет, это железо плачет!»
— «Судя по лицу, он сейчас откроет новый философский трактат о тяге в наклоне».

По слухам, скоро появятся новые кадры, где Фалеев идёт в магазин за гречкой и внезапно начинает объяснять кассиру принцип суперкомпенсации.`,
    image:
      "https://chatgpt.com/backend-api/estuary/public_content/enc/eyJpZCI6Im1fNjhjZjE2YTQ5OTY0ODE5MTljZWEyMGYzYzk1MmVjZDM6ZmlsZV8wMDAwMDAwMDFjMGM2MjJmYmMyYjk3ZjM4NWNiYmJiOCIsInRzIjoiNDg4NDQ1IiwicCI6InB5aSIsImNpZCI6IjEiLCJzaWciOiI2MmIwZDU2MzM0ZTg0NTQ0NGFmODQwZDRjN2I3YTQ5Y2MxYjI2MWJmMzMyYWZhNmEyOWU1MDdkNTBlMzY5YjMxIiwidiI6IjAiLCJnaXptb19pZCI6bnVsbCwiY3AiOm51bGwsIm1hIjpudWxsfQ==",
    category: "Politics",
    source: "Grand News",
    publishedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "",
    summary: `
    Финансовый мир потрясён: кот Илона Маска случайно «твитнул» мяу — и биткоин мгновенно обвалился на $3000.

Эксперты в панике: одни считают, что это знак о начале новой эры «CatCoin», другие пытаются перевести кошачье «мяу» через Google Translate, чтобы найти в нём скрытый сигнал.

Трейдеры рассказывают, что в момент публикации кота на графиках одновременно выросли продажи валерьянки и акций производителей корма. «Я думал, это сигнал покупать, но оказалось — просто звать кушать», — признался один из аналитиков Уолл-стрит.

Илон Маск прокомментировал ситуацию коротко: «Мой кот умнее половины инвесторов. Я не виноват, что рынок слушает его».

Между тем фанаты уже запустили токен MeowCoin. Его курс, по словам очевидцев, «растёт быстрее, чем кот на запах сосиски».
    `,
    image:
      "https://chatgpt.com/backend-api/estuary/public_content/enc/eyJpZCI6Im1fNjhjZjE3YzY3Y2Q4ODE5MWJmYTgwNGM2MWMxMDY0YzQ6ZmlsZV8wMDAwMDAwMDA5ODQ2MjJmOWQwMjk0ZjQwM2VlNjE4MCIsInRzIjoiNDg4NDQ1IiwicCI6InB5aSIsImNpZCI6IjEiLCJzaWciOiIxODc4MDVmMDRiNTY1NTNlYjFhODY5OGNmNDc5NmZiZDE4MGJhYjMyNGUwNzEwMGE0NDBlNGUyMzVlM2UxNDMyIiwidiI6IjAiLCJnaXptb19pZCI6bnVsbCwiY3AiOm51bGwsIm1hIjpudWxsfQ==",
    category: "World",
    source: "РИА Новости",
    publishedAt: new Date(Date.now() - 3600_000).toISOString(),
  },
  {
    id: "3",
    title: "«Спартак» отказался выходить на поле без Моргенштерна",
    summary: `
    Необычная ситуация произошла перед матчем: футболисты московского «Спартака» заявили, что не начнут игру, пока на стадионе не включат плейлист Моргенштерна.

По словам капитана команды, «без правильного бита невозможно нормально разогреться». Судья попытался предложить гимн Лиги чемпионов, но игроки сказали: «Это слишком академично, мы под это не двигаемся».

Зрители на трибунах не растерялись — начали хором скандировать припев из популярного трека, чем вывели соперников из равновесия.

Тренер «Спартака» заявил журналистам:
— «Я хотел тактику в три нападающих, но в итоге у нас получился рэп-баттл».

По неподтверждённым данным, Моргенштерн уже планирует гастрольный тур под названием «Чемпионат России по футболу и музыке».
    `,
    image:
      "https://sdmntprcentralus.oaiusercontent.com/files/00000000-45fc-61f5-a52d-fbc2e69518d0/raw?se=2025-09-20T22%3A15%3A08Z&sp=r&sv=2024-08-04&sr=b&scid=3073c063-ff31-5a6e-ac7b-a62f1fc45fed&skoid=add8ee7d-5fc7-451e-b06e-a82b2276cf62&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-20T12%3A28%3A30Z&ske=2025-09-21T12%3A28%3A30Z&sks=b&skv=2024-08-04&sig=%2Bgxpv/82kZ02Gqn1qzGL0mkqWhZA63wvAmU9hxM5hqU%3D",
    category: "Sports",
    source: "Комсомольская правда",
    publishedAt: new Date(Date.now() - 7200_000).toISOString(),
  },
  {
    id: "4",
    title: "Депутаты Госдумы отказались голосовать без пиццы",
    summary: `
    В кулуарах Госдумы произошёл неожиданный инцидент: депутаты нескольких фракций заявили, что не будут приступать к голосованию, пока в зал не доставят пиццу.

По словам одного из парламентариев, «обсуждать поправки на голодный желудок — это нарушение прав человека». 
Спикер пытался предложить чай с печеньем, но депутаты дружно ответили: «Это не серьёзно». 

В итоге заседание превратилось в импровизированный банкет: депутаты устроили жаркие дебаты о том, с ананасами или без должна быть пицца. 

Один из очевидцев отметил: 
— «Это было самое оживлённое обсуждение за последние годы». 

По слухам, уже готовится новая инициатива: законопроект о введении «пицца-перерыва» на всех заседаниях парламента.
    `,
    image:
      "https://dummyimage.com/600x400/ff0000/ffffff&text=Пицца+в+Госдуме",
    category: "Politics",
    source: "Лента.ру",
    publishedAt: new Date(Date.now() - 3600_000).toISOString(),
  },

];

export default function NewsPage() {
  const [period, setPeriod] = useState<"day" | "week" | "month">("day");
  const categories = useMemo(() => ["All", "Politics", "Sports", "World"], []);

  return (
    <div className="w-[390px] max-w-full min-h-screen mx-auto bg-[#0a1433] text-white relative overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-6 pb-2 flex items-center justify-between">
        <div className="text-2xl font-extrabold tracking-tight">Новости на лавке</div>
        <div className="flex items-center gap-3 opacity-80">
          <List size={22} />
          <User size={22} />
        </div>
      </div>

      <PeriodSwitch value={period} onChange={setPeriod} />

      {/* Deck + List */}
      <NewsDeck news={mock} />
      <NewsList news={mock} />

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 w-[390px] max-w-full mx-auto bg-[#08102a] border-t border-white/10 px-8 py-3 flex items-center justify-between rounded-t-2xl">
        <button className="flex flex-col items-center text-white">
          <Home size={22} />
          <span className="text-[10px] mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center text-white/70">
          <Search size={22} />
          <span className="text-[10px] mt-1">Search</span>
        </button>
        <button className="flex flex-col items-center text-white/70">
          <Bell size={22} />
          <span className="text-[10px] mt-1">Alerts</span>
        </button>
        <button className="flex flex-col items-center text-white/70">
          <User size={22} />
          <span className="text-[10px] mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
}
