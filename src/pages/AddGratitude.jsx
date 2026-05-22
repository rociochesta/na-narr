// src/pages/AddGratitude.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCcw, Eraser } from "lucide-react";
import Header3PM from "../components/Header3PM.jsx";
import BottomNav from "../components/BottomNav";


const PROMPTS = [
  "What didn’t emotionally mutiny today?",
  "What tiny thing stopped yer brain from settin’ the ship on fire?",
  "Name one thing that didn’t sink today.",
  "What helped ye not relapse into the abyss, matey?",
  "What stupidly small thing kept ye afloat today?",
  "What kept the chaos from takin’ the wheel?",
  "What made existence 2% less cursed today?",
  "What did yer addiction absolutely hate seeing ye do today?",
  "What tiny victory deserves pirate applause?",
  "What kept ye from abandonin’ ship emotionally?",
  "Name one thing ye survived without dramatics.",
  "What made reality slightly less unbearable today?",
  "What didn’t go completely sideways?",
  "What helped ye stay on this side o’ sanity?",
  "What tiny act of responsibility offended yer inner chaos goblin?",
  "What moment made ye feel slightly human again?",
  "What didn’t collapse, explode, or text yer ex today?",
  "What gave yer nervous system a brief ceasefire?",
  "What tiny thing reminded ye life ain’t entirely cursed?",
  "What kept ye from lettin’ the darkness captain the vessel today?"
];

// Generic / NA-friendly gratitude ideas
const SUGGESTIONS = [
 
  "I didn’t use today, even though me brain held a mutiny about it.",
  "I woke up clean, and apparently the sea gods allow that now.",
  "I had coffee instead of a breakdown. Pirate spirituality be strange.",
  "I said 'no' to somethin’ I used to sprint toward blindly.",
  "Someone checked on me, and I didn’t assume they wanted treasure.",
  "I slept without bargainin’ with substances. Miracles be weird, matey.",
  "Me brain wanted chaos, but I gave it hydration and a chair aboard ship.",
  "I felt feelings and didn’t explode. The crew remains confused.",
  "I laughed at somethin’ that used to sink me. That be evolution, harrr.",
  "I ate actual food instead of usin’ adrenaline as rations.",
  "I reached out before fallin’ apart. Suspiciously healthy behavior.",
  "Me addiction be offended I’m still alive. Honestly? Hilarious.",
  "I noticed silence didn’t kill me. Turns out it’s just quiet waters.",
  "I remembered I don’t have to answer every cursed thought that docks ashore.",
  "I survived a craving without applause, trophies, or cocaine. Very rude to addiction.",
  "I respected a boundary without challengin’ it to a duel.",
  "I didn’t disappear, even though abandonin’ ship felt comfortable.",
  "I realized I’m allowed to rest before earnin’ it. Revolutionary concept.",
  "I handled somethin’ badly, but not destructively. Character development, matey.",
  "I didn’t message someone who belongs in the deep ocean o’ me past.",
  "I had a roof over me head, which once felt optional.",
  "I found reasons to stay when I used to search fer escape boats.",
  "I didn’t try to fix meself in one day. I let time steer a bit.",
  "Me feelings showed up uninvited, and I didn’t evacuate the vessel.",
  "I wasn’t alone today, even though me brain tried convincin’ me otherwise.",
  "I surprised meself by carin’, even just a little.",
  "I handled a thought without turnin’ it into a full shipwreck.",
  "I didn’t search fer chaos just because calm waters felt suspicious.",
  "I lived today instead of merely survivin’ it. Didn’t know that was legal.",
  "I didn’t ask the universe to throw me overboard today. Plot twist.",
  "I chose reality over nostalgia fer destruction.",
  "I didn’t apologize fer existin’. That feels deeply illegal, harrr.",
  "I let someone help me without dyin’ o’ embarrassment.",
  "I didn’t sabotage a good moment just because I didn’t trust it.",
  "I showed up even when me brain screamed ‘abandon ship.’",
  "I didn’t quit on meself, even when it felt pointless.",
  "I gave me future permission to exist beyond today.",
  "I didn’t relapse just because discomfort boarded the ship.",
  "I remembered not everythin’ be a red flag. Some things be just people.",
  "I didn’t use today, which feels disrespectful to addiction’s expectations.",

  "I drank water like a responsible sea mammal. Who be I becoming, harrr?",
"I didn’t lose me mind today — just misplaced it below deck fer a few hours.",
"I ate breakfast before overthinkin’ me cursed existence.",
"I ignored a craving like spam mail from a sketchy merchant ship. Deleted.",
"I kept me mouth shut in a situation where chaos wanted a sequel mutiny.",
"I remembered deodorant. Recovery be havin’ layers, matey.",
"I didn’t consult the sea charts o’ doom fer imaginary illnesses today.",
"I left the ship and didn’t require a reward or a sobriety medal.",
"I sat still fer five minutes without filin’ an emotional complaint to the captain.",
"I survived a feeling without requirin’ a chemical translator.",
"I didn’t stalk me past today. Let the dead sink.",
"I used me actual alarm clock instead o’ emotional emergencies.",
"I said ‘nay’ and didn’t internally explode like cannon fire.",
"I didn’t try to trauma-bond with a random sailor. Progress, harrr.",
"I considered runnin’ away, but the price o’ rum and fuel said otherwise.",
"I didn’t argue with me brain out loud today. Small victory fer the crew.",
"I remembered passwords instead o’ relapsin’. A miracle o’ modern piracy.",
"I didn’t spiral over a text bubble. Olympic-level restraint aboard this vessel.",
"I let someone finish their sentence. Revolutionary pirate behavior.",
"I didn’t mistake boredom fer destiny. New software unlocked in the captain’s quarters.",
"I realized not every thought be a legal summons from the abyss.",
"I avoided someone who drains me sanity. Health be weird, matey.",
"I didn’t go searchin’ fer red flags. They can sail toward me if they want me that badly.",
"I found me keys where I left ’em. Miracles across the seven seas.",
"I didn’t apologize fer existing in a three-minute conversation aboard ship.",
"I used me inside voice even though chaos wanted the microphone.",
"I didn’t compare meself to another sailor today. Unbelievable scenes.",
"I cooked somethin’ that didn’t come from a crate. Me ancestors be confused.",
"I survived a phone call without emotionally sinkin’ beneath the waves.",
"I didn’t fantasize about fleein’ to another kingdom to avoid responsibility.",
"I sat with discomfort instead o’ promotin’ it to a full-blown catastrophe.",
"I made a decision without scrollin’ through existential dread first.",
"I didn’t mistake hunger fer doom. Turns out I just needed rations.",
"I let meself laugh without requirin’ a disaster fer context.",
"I didn’t diagnose meself with five new curses before breakfast.",
"I avoided a meltdown by blinkin’ aggressively instead o’ explodin’ like a powder keg.",
"I didn’t rehearse conversations that haven’t happened yet. Me brain be offended.",
"I let someone care about me without sprintin’ toward the nearest lifeboat.",
"I’m grateful I didn’t use today, even though part o’ me still wanted to.",
"I’m grateful I stayed alive long enough fer life to become slightly less unbearable, matey.",
 "I’m grateful I can feel pain without abandonin’ ship over it.",
"I’m grateful I don’t have to lie to every sailor aboard just to function anymore.",
"I’m grateful I no longer wake wonderin’ if today be the day the whole vessel sinks.",
"I’m grateful I don’t hate meself with the same consistency as before.",
"I’m grateful I can admit I was wrong without drownin’ in shame.",
"I’m grateful I don’t have to pretend I’m fine to be welcomed by the crew.",
"I’m grateful me cravings no longer captain me calendar.",
"I’m grateful I can speak honestly without expectin’ cannon fire in return.",
"I’m grateful I can sit with me thoughts without sedatin’ the entire crew.",
"I’m grateful I know what help feels like, even if askin’ fer it still feels cursed.",
"I’m grateful I don’t mistake numbness fer peace anymore, harrr.",
"I’m grateful I don’t require chaos to feel alive aboard this ship.",
"I’m grateful I don’t have to earn rest like a hostage negotiation with pirates.",
"I’m grateful facin’ meself didn’t kill me, even when it felt certain to.",
"I’m grateful I can spot me patterns before they wreck the vessel again.",
"I’m grateful I don’t have to perform strength fer acceptance anymore.",
"I’m grateful I can tell the difference between love and attention now.",
"I’m grateful I can feel somethin’ besides panic.",
"I’m grateful fer moments where joy didn’t feel suspicious or cursed.",
"I’m grateful guilt ain’t me entire personality anymore.",
"I’m grateful I’m no longer chasin’ validation like oxygen aboard a sinkin’ ship.",
"I’m grateful loneliness no longer automatically turns into self-destruction.",
"I’m grateful I can recognize a boundary before bleedin’ through it.",
"I’m grateful I don’t apologize fer existin’ quite as often.",
"I’m grateful silence no longer feels like a threat from the deep.",
"I’m grateful I don’t worship me pain like it be me pirate flag.",
"I’m grateful not every disaster be me fault.",
"I’m grateful I no longer confuse attention with affection.",
"I’m grateful hope didn’t stay buried at sea forever.",
"I’m grateful I stopped auditionin’ fer crews that never wanted me aboard.",
"I’m grateful me life ain’t just somethin’ I survive anymore.",
"I’m grateful I’m no longer waitin’ fer another sailor to rescue me.",
"I’m grateful me addiction didn’t get the final word in the captain’s log.",
"I’m grateful I can miss people without vanishin’ into the fog.",
"I’m grateful me past no longer predicts the next voyage.",
"I’m grateful existin’ no longer feels like a crime punishable by cannon.",
"I’m grateful fer the white chip, because admittin’ I had no control somehow became the strongest thing I ever did.",
"I’m grateful I don’t have to explain me madness — the whole crew already speaks pirate crazy.",
"I’m grateful fer the old-timer sailor whose stories scare me sober, harrr.",
  "I'm grateful fer slogans that sounded stupid until they kept me vessel afloat.",
"I'm grateful the meetin’ starts on time, even if me emotions arrive drunk and late.",
"I'm grateful I can sit in a room full o’ strangers and feel more understood than I ever did at home port.",
"I'm grateful the coffee tastes terrible, because it reminds me I ain’t here fer comfort, harrr.",
"I'm grateful fer the newcomer sailor who accidentally tells me story with different words.",
"I'm grateful fer the pirate who shares exactly what I needed to hear without knowin’ it.",
"I'm grateful that ‘just fer today’ be the only contract me brain can currently survive.",
"I'm grateful fer the parkin’ lot therapy sessions that outlive the actual meetin’.",
"I'm grateful there’s always another sailor laughin’ at things civilians would report to authorities.",
"I'm grateful fer the silence after someone tells the truth — feels like church without the pews aboard ship.",
"I'm grateful I don’t have to earn me seat here. Showin’ up be enough.",
"I'm grateful fer the chip I swore I’d never live long enough to receive.",
"I'm grateful fer the sailor who sends messages when I vanish before implodin’.",
"I'm grateful no one in NA expects me to be fine all the damn time.",
"I'm grateful fer the sponsor who answers the parrot-phone even when I don’t know what I’m askin’.",
"I'm grateful relapse ain’t the end o’ me story — just a nasty storm chapter.",
"I'm grateful I learned God be more concept than cannon threat.",
"I'm grateful I can say ‘I don’t know’ without feelin’ like the dumbest pirate at sea.",
"I'm grateful me pain finally came with subtitles.",
"I'm grateful I don’t have to pretend me past was normal sailor behavior.",
"I'm grateful someone shouted ‘keep comin’ back’ before I believed I deserved to.",
"I'm grateful Step One didn’t kill me, even though it stabbed me ego repeatedly.",
"I'm grateful I learned askin’ fer help ain’t a personality defect.",
"I'm grateful the steps don’t care how broken I think the ship be.",
"I'm grateful the room welcomes the version o’ me I tried to bury at sea.",
"I'm grateful laughter in NA sounds exactly like survival, matey.",
"I'm grateful I found a place where me worst moments became qualifications instead o’ disqualifications.",
"I'm grateful the meetin’ ended, but the fellowship kept sailin’.",
"I'm grateful someone told me me story weren’t unique — and somehow that felt comfortin’.",
"I'm grateful I don’t have to solve me entire cursed existence before the closin’ prayer.",
"I'm grateful I stopped mistakin’ self-destruction fer personality.",
"I'm grateful NA gave me pirates who understand sentences startin’ with ‘I swear I weren’t gonna use, but—’",
"I'm grateful I learned vulnerability don’t mean disposable.",
"I'm grateful I finally understand why sailors clap — it ain’t applause, it’s permission to exist aboard the crew.",
"I'm grateful I didn’t relapse just to prove some bastard right.",
"I'm grateful I outlived people’s expectations o’ me — emotionally and statistically, harrr.",
"I'm grateful I’m gettin’ better while they still gossip about the pirate I used to be.",
"I'm grateful I don’t need to destroy meself fer attention anymore.",
"I'm grateful I didn’t answer that cursed message me trauma wrote.",
"I'm grateful I can walk away without requirin’ an audience at the docks.",
  "I'm grateful me peace annoys the version o’ me that worshipped chaos, harrr.",
"I'm grateful me growth be happenin’ quietly — confusin’ the sailors waitin’ fer me downfall.",
"I'm grateful I can say ‘nay’ without writin’ a five-scroll apology afterward.",
"I'm grateful I stopped apologizin’ fer existin’. It ruined a lot o’ people’s evil little plans.",
"I'm grateful I didn’t shrink meself just to keep another sailor comfortable.",
"I'm grateful me progress ain’t the business o’ chronic people-pleasers aboard ship.",
"I'm grateful I learned not every pirate deserves access to me vessel.",
"I'm grateful me silence says more than all me desperate explanations ever did.",
"I'm grateful I’m healin’ in ways that make me past less relevant to the voyage.",
"I'm grateful I don’t panic when I’m excluded from ports I never wanted to visit anyway.",
"I'm grateful I no longer confuse bein’ needed with bein’ valued.",
"I'm grateful I stopped provin’ meself to sailors who never mattered in the first place.",
"I'm grateful me boundaries now hang on the wall like loaded cutlasses.",
"I'm grateful I don’t chase closure I can hand meself fer free.",
"I'm grateful I don’t argue with sailors committed to misunderstandin’ me.",
"I'm grateful I no longer perform stability fer people who preferred me broken.",
"I'm grateful I released the crew that only loved me while I was sinkin’.",
"I'm grateful I know the difference between bein’ ignored and bein’ freed.",
"I'm grateful me cursed phone no longer decides me worth as a human pirate.",
"I'm grateful I don’t need to win arguments I never wanted aboard me ship.",
"I'm grateful me healing destroyed me taste fer chaos.",
"I'm grateful the pirate I used to be no longer gets a vote in captain’s meetings.",
"I'm grateful I didn’t self-destruct just to prove a dramatic point.",
"I'm grateful I outgrew the sailors who expected me to relapse.",
"I'm grateful I finally understand silence can be a boundary instead o’ a punishment.",
"I'm grateful I choose me peace over other people’s loud opinions.",
"I'm grateful I be the one who escaped — from meself, matey.",
"I'm grateful I proved me addiction wrong simply by continuin’ to exist.",
"I'm grateful I’m becomin’ someone I would’ve envied before recovery.",
"I'm grateful I don’t talk to meself like I be the enemy anymore.",
"I'm grateful I finally understand wantin’ love don’t make me weak.",
"I'm grateful I no longer treat kindness like a trap laid by enemy ships.",
"I'm grateful I can accept compliments without demandin’ physical evidence.",
"I'm grateful I’m learnin’ to believe sailors when they say they care.",
"I'm grateful I stopped confusin’ bein’ needed with bein’ worthy.",
"I'm grateful I no longer apologize fer takin’ up oxygen aboard this ship.",
"I'm grateful I’m startin’ to see meself as someone worth stayin’ clean fer.",
"I'm grateful I can take up space without feelin’ like a problem below deck.",
"I'm grateful I don’t shrink meself to fit ports I’ve already outgrown.",
"I'm grateful I’m no longer terrified o’ bein’ truly seen, harrr.",
  "I'm grateful I don’t assume every sailor aboard be waitin’ fer me to fail.",
"I'm grateful I can celebrate me progress without immediately sinkin’ it with self-hatred.",
"I'm grateful I don’t treat every mistake like proof I’m cursed.",
"I'm grateful I’m learnin’ the difference between humility and erasin’ meself.",
"I'm grateful I know I don’t need to earn me right to exist aboard this ship.",
"I'm grateful I finally understand boundaries protect me vessel — they ain’t punishment.",
"I'm grateful I’m becomin’ a pirate I actually trust.",
"I'm grateful I no longer confuse attention with affection from random sailors.",
"I'm grateful I can speak honestly about me past without wearin’ it as me entire identity.",
"I'm grateful me worth ain’t measured by how much suffering I can survive.",
"I'm grateful I can love the parts o’ meself I once buried below deck.",
"I'm grateful I stopped callin’ survival a personality trait.",
"I'm grateful I no longer chase approval like oxygen at sea.",
"I'm grateful I know I’m allowed to want things without askin’ permission from the universe.",
"I'm grateful I don’t disappear when someone gets emotionally close aboard ship.",
"I'm grateful I’m no longer terrified o’ success, matey.",
"I'm grateful I can imagine a future without constantly bracin’ fer impact.",
"I'm grateful I’m learnin’ to care fer meself without conditions and contracts.",
"I'm grateful hope didn’t stay dead at the bottom o’ the ocean forever.",
"I'm grateful I finally understand who I am ain’t a mistake.",
"I'm grateful I’m startin’ to like the pirate I’m becoming.",
"I'm grateful I stopped rehearsin’ rejection before it even happens.",
"I'm grateful me identity ain’t defined by failure anymore.",
"I'm grateful I treat meself like an actual human now instead o’ a cursed sea creature.",
"I'm grateful I finally know wantin’ more don’t make me greedy.",
"I'm grateful I’m allowed to stay aboard.",
"I'm grateful believin’ in meself no longer feels cringe-worthy.",
"I'm grateful I no longer vanish from me own life, harrr.",

"I had a bed to sleep in and a roof over me head.",
"I had food today and didn’t have to hustle, scheme, or lie fer it.",
"I have clean clothes to wear and didn’t need to borrow ’em from another sailor.",
"I have runnin’ water, which I used to ignore like spoiled royalty.",
"I can take a shower whenever I want. That once felt optional aboard me old life.",
"I have a phone that connects me to people instead o’ destroyin’ me.",
"I have a place to sit, sleep, and exist without bein’ chased from the docks.",
"I woke up in the same place I fell asleep. Stability be underrated treasure.",
"I have electricity, which means I can cook, charge me devices, and avoid freezin’ to death.",
"I have access to a bathroom without askin’ permission like a prisoner aboard ship.",
"I didn’t have to wonder where I’d sleep tonight.",
"I have shoes that fit and don’t torture me feet. The toes be grateful.",
"I have a fridge with actual food in it. That weren’t always true, matey.",
"I have a blanket that keeps me warm without emotional strings attached.",
"I have toothpaste, deodorant, and soap — basic dignity in bottle form.",
"I have a pillow. Me neck finally stopped mutinyin’.",
"I have cups, plates, and utensils. I’m no longer eatin’ like a raccoon behind a tavern.",
"I have Wi-Fi, which keeps me connected to recovery instead o’ chaos.",
"I have a door I can close, which means safety exists.",
"I have time today that wasn’t swallowed whole by addiction.",
"I have places I can go where nobody be demandin’ somethin’ from me.",
"I have space that belongs to me, even if it be small as a cabin.",
"I have heat when it’s cold and shade when it’s hot. Luxury disguised as normal life.",
"I didn’t have to fight fer survival today. That ain’t nothin’, harrr.",
"I have a pillow, a blanket, and a tomorrow. I never used to plan fer tomorrows."
];

// Humor categories (solo estas se muestran)
const FUNNY_CATEGORIES = [
  "Small wins",
  "My brain today",
  "People & other complications",
  "Things that didn’t implode",
  "Reasons I didn’t relapse",
];

const NEUTRAL_CATEGORIES = [
  "Something I did right",
  "Something I learned",
  "Someone who showed up",
  "Something that helped",
  "Something that changed",
];

function getRandomPrompt() {
  const idx = Math.floor(Math.random() * PROMPTS.length);
  return PROMPTS[idx];
}

function getRandomSuggestion() {
  const idx = Math.floor(Math.random() * SUGGESTIONS.length);
  return SUGGESTIONS[idx];
}

export default function AddGratitude() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [error, setError] = useState("");
  const [inspo, setInspo] = useState(() => getRandomSuggestion());

  const prompt = useMemo(() => getRandomPrompt(), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!text.trim()) {
      setError("Write at least one line, matey. It don’t need to sound wise.");
      return;
    }

    // 📅 Fecha según zona horaria de Edmonton
    const edmontonNow = new Date(
      new Date().toLocaleString("en-US", { timeZone: "America/Edmonton" })
    );
    edmontonNow.setHours(0, 0, 0, 0);

    const isoDate = [
      edmontonNow.getFullYear(),
      String(edmontonNow.getMonth() + 1).padStart(2, "0"),
      String(edmontonNow.getDate()).padStart(2, "0"),
    ].join("-");

    let categoryFunny = "Other";
    let category = "Other";

    if (selectedIndex !== null) {
      categoryFunny = FUNNY_CATEGORIES[selectedIndex];
      category = NEUTRAL_CATEGORIES[selectedIndex];
    }

    const entry = {
      id: Date.now().toString(),
      text: text.trim(),
      categoryFunny,
      category,
      date: isoDate,
    };

    try {
      const raw = window.localStorage.getItem("na_gratitudes");
      const list = raw ? JSON.parse(raw) : [];
      const newList = Array.isArray(list) ? [...list, entry] : [entry];
      window.localStorage.setItem("na_gratitudes", JSON.stringify(newList));
    } catch (err) {
      console.error("Error saving gratitude:", err);
      setError("Couldn’t save this one, but it still counts.");
      return;
    }

    // Reset para que puedas seguir agregando
    setText("");
    setSelectedIndex(null);
    setInspo(getRandomSuggestion());
  };

  return (
    <div className="min-h-screen bg-[#0b0c0f] text-[#e5d3ad] flex flex-col">
      <Header3PM />

      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 py-6 space-y-5">

          {/* NARR intro / ritual */}
          <section className="relative bg-[#0f1012]/70 border border-[#6f5630]/25 rounded-2xl px-4 py-3 space-y-1 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c6a56b]/30 to-transparent" />
            <p className="text-[11px] uppercase tracking-[0.20em] text-[#c6a56b]">
              NARR check-in
            </p>
            <p className="text-xs text-[#8d9199]">
              One sentence that proves ye didn't let yer addiction win today.
            </p>
          </section>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Textarea card */}
            <div className="bg-[#0f1012]/70 border border-[#6f5630]/25 rounded-2xl px-4 py-3 space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="gratitudeText"
                  className="block text-xs font-medium uppercase tracking-[0.18em] text-[#c6a56b]"
                >
                  What are ye grateful for?
                </label>
                <span className="text-[10px] text-[#6b7078]">
                  It can be dumb. It still counts.
                </span>
              </div>

              <div className="relative mt-1">
                <textarea
                  id="gratitudeText"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  className="w-full bg-[#0b0c0f] border border-[#6f5630]/35 rounded-xl px-3 py-2 text-sm text-[#e5d3ad] placeholder:text-[#4a4f58] focus:outline-none focus:border-[#c6a56b]/70 focus:ring-1 focus:ring-[#c6a56b]/40 resize-none pr-9 transition-colors"
                  placeholder={prompt}
                />
                {text.trim() && (
                  <button
                    type="button"
                    onClick={() => setText(“")}
                    className="absolute right-2 top-2 text-[#6b7078] hover:text-[#c97070] hover:bg-[#2a0f0f]/50 p-1 rounded transition-colors"
                    title="Clear text"
                  >
                    <Eraser size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Inspiration box */}
            <section className="bg-[#0f1012]/70 border border-[#6f5630]/25 rounded-2xl px-4 py-3 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#c6a56b]">
                    Need an idea?
                  </p>
                  <p className="text-[11px] text-[#6b7078]">
                    Tap until one feels true. Then tweak it.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setInspo(getRandomSuggestion())}
                  className="p-1.5 rounded-full border border-[#6f5630]/40 bg-[#15171b] text-[#8d9199] hover:border-[#c6a56b]/70 hover:text-[#d4b06a] transition-colors"
                  title="New suggestion"
                >
                  <RefreshCcw size={14} />
                </button>
              </div>

              <p className="text-sm text-[#e5d3ad] italic leading-snug">
                "{inspo}"
              </p>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!text.trim()) setText(inspo);
                    else setText((prev) => `${prev}\n${inspo}`);
                  }}
                  className="text-[10px] px-3 py-1 border border-[#6f5630]/40 rounded-full text-[#8d9199] hover:border-[#c6a56b]/70 hover:text-[#e5d3ad] transition-colors"
                >
                  Use this (or edit it)
                </button>
              </div>
            </section>

            {/* Categories as vibe tags */}
            <div className="bg-[#0f1012]/70 border border-[#6f5630]/25 rounded-2xl px-4 py-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#c6a56b]">
                  Category (optional)
                </p>
                <span className="text-[10px] text-[#6b7078]">
                  Tag the vibe fer future-ye.
                </span>
              </div>

              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FUNNY_CATEGORIES.map((label, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() =>
                        setSelectedIndex((prev) => prev === idx ? null : idx)
                      }
                      className={`text-xs rounded-lg border px-3 py-2 text-left transition-colors ${
                        isSelected
                          ? “border-[#c6a56b]/80 bg-[#c6a56b]/10 text-[#e5d3ad] shadow-[0_0_14px_rgba(198,165,107,0.2)]"
                          : “border-[#6f5630]/30 bg-[#0b0c0f] text-[#8d9199] hover:border-[#c6a56b]/50 hover:text-[#e5d3ad]"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-[#c97070] bg-[#2a0f0f]/50 border border-[#7a3535]/50 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                type="submit"
                className={`w-full text-sm font-semibold tracking-wide border rounded-xl py-2.5 transition-colors ${
                  text.trim()
                    ? “border-[#c6a56b]/80 text-[#e5d3ad] bg-[#c6a56b]/10 hover:bg-[#c6a56b]/18 shadow-[0_0_18px_rgba(198,165,107,0.15)]"
                    : “border-[#6f5630]/30 text-[#6b7078] bg-[#0f1012] hover:border-[#c6a56b]/40 hover:text-[#8d9199]"
                }`}
              >
                Save gratitude
              </button>

              <button
                type="button"
                onClick={() => navigate(“/")}
                className="w-full text-sm font-semibold tracking-wide border border-[#6f5630]/30 text-[#8d9199] rounded-xl py-2.5 hover:bg-[#17120d] hover:text-[#e5d3ad] transition-colors"
              >
                Back to home
              </button>

              <button
                type="button"
                onClick={() => navigate(“/gratitudes")}
                className="w-full text-[11px] font-medium text-[#c6a56b] hover:text-[#d4b06a] underline underline-offset-2 transition-colors"
              >
                View & share today's gratitude list
              </button>
            </div>
          </form>

          <p className="pt-2 text-[11px] text-center text-[#4a4f58]">
            This might feel small. Yer addiction hates that it still counts.
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
