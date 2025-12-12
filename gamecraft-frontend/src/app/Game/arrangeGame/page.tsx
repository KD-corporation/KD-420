"use client";

import React, { useEffect, useMemo, useState, } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Sparkles,
  RotateCcw,
  Copy,
  HelpCircle,
  Trophy,
  Star,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";

// dnd-kit imports
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy, 
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type SentenceConfig = {
  id: number;
  text: string;
  hint?: string;
};

interface Props {
  sentences?: SentenceConfig[];
  showAnswers?: boolean;
}

// --------------------------
// SORTABLE ITEM COMPONENT
// --------------------------

const SortableToken = ({ token, id }: { token: string; id: string }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : 0, 
    margin: '4px', // Helps with spacing in flex-wrap
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-sm font-bold shadow-md transition-all
        ${isDragging 
            ? 'opacity-70 ring-4 ring-blue-300 transform scale-105 shadow-xl' 
            : 'hover:scale-105 hover:shadow-lg'
        }
        min-w-fit cursor-grab
      `}
    >
      {token}
    </div>
  );
};

// --------------------------
// MAIN COMPONENT LOGIC & UI
// --------------------------


type QuesObject = {
  id: number;
  text: string;
  hint: string;
};

const DEFAULT_SENTENCES: QuesObject[] = [
    {
      id: 1,
      text: "SELECT * FROM orders WHERE customerid = 1;",
      hint: "Basic SELECT query filtering by customerid",
    },
    {
      id: 2,
      text: "SELECT name , price FROM products ORDER BY price DESC;",
      hint: "Sorting products from highest price to lowest",
    },
    {
      id: 3,
      text: "INSERT INTO customers ( name , email ) VALUES ( 'John' , 'john@example.com' );",
      hint: "Insert a new customer",
    },
];

export default function SentenceArrangeGame({
  sentences = DEFAULT_SENTENCES,
  showAnswers = false,
}: Props) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedTokens, setSelectedTokens] = useState<{ id: string; token: string }[]>([]);

  const [message, setMessage] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const searchParams = useSearchParams();
 

  // LOGIC: Determine which sentences to use based on URL (same as before)
  const activeSentences = useMemo<QuesObject[]>(() => {
    const idParam = searchParams.get("id");
    const titleParam = searchParams.get("ans"); 
    const hintParam = searchParams.get("text"); 

    if (idParam && titleParam && hintParam) {
      return [
        {
          id: Number(idParam),
          text: titleParam,
          hint: hintParam,
        },
      ];
    } else {
      return sentences as QuesObject[];
    }
  }, [searchParams, sentences]);
  
  useEffect(() => {
    if (currentIndex >= activeSentences.length) {
        setCurrentIndex(0);
    }
  }, [activeSentences.length]);


  const currentSentence = useMemo(
    () => activeSentences[currentIndex],
    [activeSentences, currentIndex]
  );
  

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function tokenize(text: string): string[] {
    return (
      text.match(/('[^']*'|\b\w+\b|[.,*()=;<>@])/g) || []
    )
      .map((t) => t.trim())
      .filter(Boolean);
  }

  function normalizeSentence(text: string): string {
    return text
      .trim()
      .replace(/\s+/g, " ")
      .replace(/\s+([.,;:!?()])/g, "$1")
      .toLowerCase();
  }

  const normalizedCorrect = useMemo(
    () => normalizeSentence(currentSentence.text),
    [currentSentence.text]
  );


  function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const generateTokenId = (token: string, index: number) =>
    `${token.replace(/[^a-zA-Z0-9]/g, '_')}-${index}-${Date.now()}`;


  function setupSentence() {
    const tokens = tokenize(currentSentence.text);
    
    if (!tokens.length) {
        setSelectedTokens([]);
        setMessage("Error: Question text is empty.");
        return;
    }

    const shuffledTokenObjects = shuffle(tokens).map((token, index) => ({
      id: generateTokenId(token, index),
      token: token,
    }));

    setSelectedTokens(shuffledTokenObjects);

    setMessage("Arrange the tokens by dragging and dropping them into the correct order.");
    setIsCorrect(null);
    setShowConfetti(false);
  }

  useEffect(() => {
    setupSentence();
  }, [currentSentence.id, currentSentence.text]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSelectedTokens((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over!.id);

        return arrayMove(items, oldIndex, newIndex);
      });
      setIsCorrect(null);
      setMessage("Arrangement changed. Check your answer again.");
    }
  };

  const handleCheck = () => {
    const assembledTokens = selectedTokens.map(t => t.token);
    const assembled = assembledTokens.join(" ");
    const normalizedAssembled = normalizeSentence(assembled);

    setAttempts((prev) => prev + 1);

    if (!assembled.trim()) {
      setMessage("⚠️ You have not arranged any tokens yet.");
      setIsCorrect(false);
      return;
    }

    if (normalizedAssembled === normalizedCorrect) {
      setIsCorrect(true);
      setMessage("🎉 Correct! You've arranged the sentence perfectly.");
      setScore((prev) => prev + 10);
      setStreak((prev) => prev + 1);
      setShowConfetti(true);
    } else {
      setIsCorrect(false);
      setMessage("❌ Not quite right. Try adjusting the order.");
      setStreak(0);
      setShowConfetti(false);
    }
  };

  const handleNextSentence = () => {
    const nextIndex = (currentIndex + 1) % activeSentences.length;
    setCurrentIndex(nextIndex);
  };

  const handleResetSentence = () => setupSentence();

  const handleClearSelected = () => {
    setupSentence(); 
    setIsCorrect(null);
    setMessage("🧹 Cleared/Shuffled. Start arranging again.");
    setShowConfetti(false);
  };

  const handleCopySentence = () => {
    const assembled = selectedTokens.map(t => t.token).join(" ");
    const textToCopy = assembled || currentSentence.text;
    navigator.clipboard?.writeText(textToCopy);
    setMessage("📋 Sentence/query copied to clipboard!");
  };

  const selectedTokenIds = useMemo(() => selectedTokens.map(t => t.id), [selectedTokens]);

  return (
    <>
      {/* CONFETTI STYLES (Keep the same) */}
      <style jsx>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .confetti {
          position: fixed; width: 10px; height: 10px; z-index: 1000;
          animation: confetti-fall 3s linear forwards;
        }
      `}</style>

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(70)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                background: ["#fbbf24", "#f97316", "#8b5cf6", "#3b82f6", "#22c55e"][
                  Math.floor(Math.random() * 5)
                ],
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="min-h-screen p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          
          {/* MAIN GAME CARD CONTAINER */}
          <div className="bg-gradient-to-r from-indigo-700 to-purple-800 p-4 pt-6 rounded-2xl shadow-xl mb-6 border-2 border-indigo-500">
            
            {/* TOP HEADER SECTION (FIXED FOR UI CONSISTENCY) */}
            <div className="flex justify-between items-start mb-4 px-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold flex items-start gap-2">
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 mt-1 text-yellow-300" />
                    <span className="flex flex-col leading-none">
                        <span className="text-sm text-indigo-300 font-medium">Sentence Arrange</span>
                        <span className="text-white">Arena</span>
                    </span>
                </h1>
                
                <button
                    onClick={handleNextSentence}
                    disabled={activeSentences.length < 2} 
                    className="px-4 py-2 bg-white text-purple-700 rounded-lg font-bold shadow hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-1"
                >
                    Next <ArrowRight className="w-4 h-4" />
                </button>
            </div>
            
            {/* STATS ROW (Fixed to match the look) */}
            <div className="flex flex-wrap justify-between gap-3 p-2 border-y border-indigo-500/50">
                <div className="bg-white/20 px-3 py-1 rounded-full text-xs flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-300" />
                    <span>Score: {score}</span>
                </div>
                <div className="bg-white/20 px-3 py-1 rounded-full text-xs flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-300" />
                    <span>Streak: {streak}</span>
                </div>
                <div className="bg-white/20 px-3 py-1 rounded-full text-xs flex items-center gap-2">
                    <span>Sentence: {currentIndex + 1}/{activeSentences.length}</span>
                </div>
                <div className="bg-white/20 px-3 py-1 rounded-full text-xs flex items-center gap-2">
                    <span>Attempts: {attempts}</span>
                </div>
            </div>

            {/* MESSAGE (Moved inside the main container) */}
            {message && isCorrect === null && (
                <div className="p-3 bg-yellow-500 text-black text-center font-semibold rounded-lg mt-4 text-sm">
                    {message}
                </div>
            )}
            
          </div> {/* END MAIN GAME CARD */}


          <div className="flex flex-col lg:flex-row gap-6">
            {/* LEFT COLUMN - GAMEPLAY */}
            <div className="flex-1 space-y-4">
              {/* Hint */}
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
                <h2 className="text-lg font-bold flex items-center gap-2 text-sky-400">
                  <HelpCircle className="w-5 h-5" />
                  Sentence / Query Hint
                </h2>
                <p className="text-slate-200 mt-2">
                  {currentSentence.hint ||
                    "Arrange the tokens below to form a valid sentence or query."}
                </p>
              </div>

              {/* Your Arrangement (DRAG-AND-DROP AREA) */}
              <div className="bg-slate-800 p-6 rounded-xl border-2 border-blue-600 shadow-2xl">
                <div className="flex justify-between items-center mb-3 gap-2">
                  <h3 className="font-bold text-lg flex items-center gap-2 text-blue-300">
                    Your Tokens
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopySentence}
                      className="p-2 bg-slate-900 rounded-lg border border-slate-600 text-xs sm:text-sm hover:bg-slate-700 transition"
                      title="Copy arranged sentence"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleClearSelected}
                      disabled={!selectedTokens.length}
                      className="p-2 bg-slate-900 rounded-lg border border-slate-600 text-xs sm:text-sm hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Reshuffle Tokens"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* DND AREA */}
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex flex-wrap items-center bg-slate-900 p-2 rounded-lg min-h-[100px] border border-slate-700">
                    {selectedTokens.length ? (
                      <SortableContext
                        items={selectedTokenIds}
                        strategy={rectSortingStrategy} 
                      >
                        {selectedTokens.map((item) => (
                          <SortableToken
                            key={item.id}
                            id={item.id}
                            token={item.token}
                          />
                        ))}
                      </SortableContext>
                    ) : (
                      <span className="text-gray-500 text-sm p-4 w-full text-center">
                        Tokens are loading or question text is empty.
                      </span>
                    )}
                  </div>
                </DndContext>

                {/* RESULT MESSAGE */}
                {isCorrect !== null && (
                    <div
                        className={`p-3 rounded-lg text-center font-bold mt-4 text-sm transition-all duration-300 ${isCorrect
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                    >
                        {isCorrect === true && (
                            <CheckCircle2 className="inline w-4 h-4 mr-2 align-middle" />
                        )}
                        {isCorrect === false && (
                            <XCircle className="inline w-4 h-4 mr-2 align-middle" />
                        )}
                        {message}
                    </div>
                )}

                {/* Live Arranged Output */}
                <pre className="mt-4 p-3 bg-black/60 text-green-400 rounded-lg text-[11px] sm:text-xs font-mono border border-slate-700 whitespace-pre-wrap">
                  {selectedTokens.map(t => t.token).join(" ") || "// Drag tokens above to arrange..."}
                </pre>


                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <button
                    onClick={handleCheck}
                    className="flex-1 py-3 bg-emerald-600 rounded-lg font-bold hover:bg-emerald-500 hover:scale-[1.02] transition shadow-lg"
                  >
                    <CheckCircle2 className="inline w-4 h-4 mr-1" />
                    Check Answer
                  </button>
                  <button
                    onClick={handleResetSentence}
                    className="flex-1 py-3 bg-gray-600 rounded-lg font-bold hover:bg-gray-500 hover:scale-[1.02] transition shadow-lg"
                  >
                    <RotateCcw className="inline w-4 h-4 mr-1" />
                    Reset Sentence
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - INFO & HOW TO PLAY */}
            <div className="w-full lg:w-80 space-y-4">
              {showAnswers && (
                <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 text-black border border-green-400">
                  <h3 className="font-bold text-lg mb-2">
                    Target Sentence / Query (Answer)
                  </h3>
                  <pre className="p-3 bg-black text-green-400 rounded-xl text-xs font-mono whitespace-pre-wrap border border-slate-700">
                    {currentSentence.text}
                  </pre>
                </div>
              )}

              <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-4 rounded-2xl text-black border border-indigo-300 shadow-lg">
                <h3 className="font-bold text-sm mb-2">How to Play</h3>
                <p className="text-xs space-y-1">
                  <span className="block">
                    1. The blue tokens are the query parts.
                  </span>
                  <span className="block">
                    2. **Drag and drop** tokens within the blue box to arrange them in the correct sequence.
                  </span>
                  <span className="block">
                    3. Press <b>Check Answer</b> to validate order.
                  </span>
                  <span className="block">
                    4. **Reset Sentence** re-shuffles the tokens.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}