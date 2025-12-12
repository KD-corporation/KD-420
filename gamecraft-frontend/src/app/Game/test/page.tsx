"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  RotateCcw,
  Copy,
  Trash2,
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
  verticalListSortingStrategy,
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

// एक रैपर जो dnd-kit को token button को dragable बनाने की अनुमति देता है
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
    zIndex: isDragging ? 10 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      // token को अब केवल dragable बनाया गया है, क्लिक करने पर कोई कार्रवाई नहीं होगी
      className={`
        px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-xs sm:text-sm font-bold shadow transition
        ${isDragging ? 'opacity-50 ring-4 ring-blue-300' : 'hover:scale-105'}
        min-w-fit cursor-grab
      `}
    >
      {token}
    </div>
  );
};

// --------------------------
// MAIN COMPONENT
// --------------------------

export default function SentenceArrangeGame({
  sentences = [
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
  ],
  showAnswers = false,
}: Props) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // सभी टोकन अब यहीं पर रहेंगे, और इन्हें ड्रैग करके व्यवस्थित किया जाएगा
  const [selectedTokens, setSelectedTokens] = useState<{ id: string; token: string }[]>([]);
  
  const [message, setMessage] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const currentSentence = useMemo(
    () => sentences[currentIndex],
    [sentences, currentIndex]
  );

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // --------------------------
  // TOKENIZATION & NORMALIZATION
  // --------------------------

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
    // Shuffle the tokens and convert them into the required object format
    const shuffledTokenObjects = shuffle(tokens).map((token, index) => ({
        id: generateTokenId(token, index),
        token: token,
    }));
    
    // Available tokens state is removed, load directly into selectedTokens
    setSelectedTokens(shuffledTokenObjects); 
    
    setMessage("Arrange the tokens by dragging and dropping them into the correct order.");
    setIsCorrect(null);
    setShowConfetti(false);
  }

  useEffect(() => {
    setupSentence();
  }, [currentSentence.id]);

  // --------------------------
  // DRAG END HANDLER (Only action needed now)
  // --------------------------
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSelectedTokens((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over!.id);

        return arrayMove(items, oldIndex, newIndex);
      });
      // Drag के बाद उत्तर की स्थिति रीसेट करें
      setIsCorrect(null);
      setMessage("Arrangement changed. Check your answer again.");
    }
  };


  // --------------------------
  // CHECK ANSWER & NAVIGATION
  // --------------------------
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
    const nextIndex = (currentIndex + 1) % sentences.length;
    setCurrentIndex(nextIndex);
  };

  const handleResetSentence = () => setupSentence();

  // Clear now means shuffling the tokens again (since no tokens are removed)
  const handleClearSelected = () => {
    setupSentence(); // Reshuffle tokens
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

  // --------------------------
  // UI
  // --------------------------
  
  const selectedTokenIds = useMemo(() => selectedTokens.map(t => t.id), [selectedTokens]);

  return (
    <>
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .confetti {
          position: fixed;
          width: 10px;
          height: 10px;
          z-index: 1000;
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
          {/* HEADER */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-2xl shadow-xl mb-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
              <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-3">
                <Sparkles className="w-8 h-8" />
                Sentence Arrange Arena
              </h1>
              <button
                onClick={handleNextSentence}
                className="px-6 py-2 bg-white text-purple-700 rounded-xl font-bold shadow hover:scale-105 transition"
              >
                <ArrowRight className="inline w-4 h-4 mr-1" />
                Next Sentence
              </button>
            </div>

            <div className="flex flex-wrap gap-3 mt-4 text-xs sm:text-sm">
              <div className="bg-white/20 px-4 py-1.5 rounded-full flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-300" />
                <span>Score: {score}</span>
              </div>
              <div className="bg-white/20 px-4 py-1.5 rounded-full flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-300" />
                <span>Streak: {streak}</span>
              </div>
              <div className="bg-white/20 px-4 py-1.5 rounded-full flex items-center gap-2">
                <span>
                  Sentence: {currentIndex + 1}/{sentences.length}
                </span>
              </div>
              <div className="bg-white/20 px-4 py-1.5 rounded-full flex items-center gap-2">
                <span>Attempts: {attempts}</span>
              </div>
            </div>
          </div>


          {/* MESSAGE */}
          {message && (
            <div
              className={`p-4 rounded-xl text-center font-bold mb-4 ${
                isCorrect
                  ? "bg-green-500"
                  : isCorrect === false
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }`}
            >
              {isCorrect === true && (
                <CheckCircle2 className="inline w-5 h-5 mr-2 align-middle" />
              )}
              {isCorrect === false && (
                <XCircle className="inline w-5 h-5 mr-2 align-middle" />
              )}
              {message}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6">
            {/* LEFT */}
            <div className="flex-1 space-y-4">
              {/* Hint */}
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-sky-300" />
                  Sentence / Query Hint
                </h2>
                <p className="text-slate-200 mt-2">
                  {currentSentence.hint ||
                    "Arrange the tokens below to form a valid sentence or query."}
                </p>
              </div>

              {/* Your Arrangement (DRAG-AND-DROP AREA) */}
              {/* This section now combines Available and Selected tokens */}
              <div className="bg-slate-800 p-6 rounded-xl border border-blue-600">
                <div className="flex justify-between items-center mb-3 gap-2">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-emerald-400" />
                    Your Tokens (Drag to Rearrange)
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopySentence}
                      className="px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-600 text-xs sm:text-sm"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleClearSelected}
                      disabled={!selectedTokens.length}
                      className="px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-600 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Reshuffle Tokens"
                    >
                      <RotateCcw className="w-4 h-4" /> {/* Changed to Rotate/Shuffle icon */}
                    </button>
                  </div>
                </div>

                {/* DND Context for drag and drop */}
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex flex-wrap gap-2 bg-slate-900 p-4 rounded-lg min-h-[80px]">
                    {selectedTokens.length ? (
                      <SortableContext 
                        items={selectedTokenIds} 
                        strategy={verticalListSortingStrategy}
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
                      <span className="text-gray-500 text-sm">
                        Loading tokens...
                      </span>
                    )}
                  </div>
                </DndContext>
                
                <pre className="mt-4 p-3 bg-black/60 text-green-400 rounded-lg text-[11px] sm:text-xs font-mono border border-slate-700">
                  {selectedTokens.map(t => t.token).join(" ") || "// Drag tokens above to arrange..."}
                </pre>


                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <button
                    onClick={handleCheck}
                    className="flex-1 py-2 bg-emerald-600 rounded-lg font-bold hover:scale-105 transition"
                  >
                    <CheckCircle2 className="inline w-4 h-4 mr-1" />
                    Check Answer
                  </button>
                  <button
                    onClick={handleResetSentence}
                    className="flex-1 py-2 bg-gray-600 rounded-lg font-bold hover:scale-105 transition"
                  >
                    <RotateCcw className="inline w-4 h-4 mr-1" />
                    Reset Sentence
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="w-full lg:w-80 space-y-4">
              {showAnswers && (
                <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 text-black">
                  <h3 className="font-bold text-lg mb-2">
                    Target Sentence / Query
                  </h3>
                  <pre className="p-3 bg-black text-green-400 rounded-xl text-xs font-mono whitespace-pre-wrap border border-slate-700">
                    {currentSentence.text}
                  </pre>
                </div>
              )}

              <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-4 rounded-2xl text-black border border-indigo-300">
                <h3 className="font-bold text-sm mb-2">How to Play</h3>
                <p className="text-xs space-y-1">
                  <span className="block">
                    1. All tokens are available below.
                  </span>
                  <span className="block">
                    2. **Drag and drop** tokens to arrange them in the correct SQL query order.
                  </span>
                  <span className="block">
                    3. Press <b>Check Answer</b> to validate order.
                  </span>
                  <span className="block">
                    4. **Reset Sentence** reshuffles the tokens.
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