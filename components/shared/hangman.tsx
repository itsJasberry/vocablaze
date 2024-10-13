"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCharacterSet } from "@/helpers/file";
import { Button, CircularProgress, Input } from "@nextui-org/react";
import { WordSet as PrismaWordSetType } from "@prisma/client";
import { ArrowLeft } from "lucide-react";

import { useWordProgress, WordSet } from "@/hooks/useWordProgress";
import { CheckIcon, HangmanDrawing } from "@/components/shared/hangman-drawing";

import { WordProgress } from "./word-progress";
import { useMediaQuery } from "@/hooks/use-media-query";

const HangmanGame = ({ wordSet }: { wordSet: WordSet | PrismaWordSetType }) => {
  const pathname = usePathname().split("/")[2];
  const { words, currentWord, loading, handleDontKnowWord, handleKnowWord } =
    useWordProgress(wordSet as WordSet);
  const mediaQuery = useMediaQuery('(min-width: 768px)');

  const [nWrong, setNWrong] = useState<number>(0);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">(
    "playing"
  );
  const [manualGuess, setManualGuess] = useState<string>("");

  const guessedWord = useCallback(() => {
    return currentWord
      .split("")
      .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
      .join(" ");
  }, [currentWord, guessedLetters]);

  useEffect(() => {
    console.log("Game state updated");
    console.log("nWrong:", nWrong);
    console.log("guessedWord:", guessedWord());
    console.log("currentWord:", currentWord);

    if (nWrong >= 6) {
      setGameState("lost");
    } else if (currentWord && guessedWord().replace(/ /g, "") === currentWord) {
      setGameState("won");
    }
  }, [nWrong, guessedLetters, currentWord, guessedWord]);

  const handleNextWord = () => {
    setGameState("playing");
    setGuessedLetters([]);
    setNWrong(0);
  };

  const handleGuess = (letter: string) => {
    setGuessedLetters((prev) => [...prev, letter]);

    if (!currentWord.includes(letter)) {
      setNWrong((prev) => prev + 1);
    }
  };

  const handleManualGuess = () => {
    if (manualGuess) {
      handleGuess(manualGuess);
      setManualGuess("");
    }
  };

  const Buttons = () => {
    const characterSet = getCharacterSet(
      (wordSet as WordSet)?.secondLanguage?.name || "English"
    );
    return characterSet.map((letter) => (
      <Button
        key={letter}
        onClick={() => handleGuess(letter)}
        isDisabled={guessedLetters.includes(letter)}
        variant="shadow"
        size={mediaQuery ? "md" : "sm"}
        className="font-bold text-white bg-indigo-400 p-0"
      >
        {letter}
      </Button>
    ));
  };

  const isLatin =
    getCharacterSet((wordSet as WordSet)?.secondLanguage?.name as string)
      .length > 0;

  return (
    <div className="content bg-white/80 shadow-xl backdrop-blur-2xl mx-auto w-full max-w-[850px] dark:bg-slate-900/90 rounded-[2rem] overflow-hidden py-6 px-2 md:px-6">
      <div className="absolute top-0 right-0 p-2 z-20">
        <WordProgress progress={words[currentWord]?.progress * 100} />
      </div>
      {loading ? (
        <div className="flex justify-center items-center min-h-[656px]">
          <CircularProgress size="lg" />
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-between ">
          <Button
            isIconOnly
            className="rounded-full max-w-[40px] cursor-pointer p-0 absolute top-[10px] left-[10px]"
          >
            <Link href={`/wordset/${pathname}`}>
              <ArrowLeft />
            </Link>
          </Button>
          {gameState === "playing" && (
            <>
              <div>
                <p className="pr-4">
                  {(wordSet as WordSet)?.firstLanguage?.name} word:{" "}
                  <strong>{words[currentWord]?.translatedWord}</strong>
                </p>
                <p>
                  Translate it to{" "}
                  <strong>{(wordSet as WordSet)?.secondLanguage?.name}</strong>
                </p>
                <p className="pr-4">
                  Guessed wrong: <strong>{nWrong}</strong>
                </p>
              </div>
              <h1 className="flex pt-5 flex-wrap justify-center w-[90%] text-xl">
                {guessedWord()}
              </h1>
              <HangmanDrawing nWrong={nWrong} />
              <div className="flex flex-wrap gap-2 justify-center items-center">
                {isLatin ? (
                  <Buttons />
                ) : (
                  <div className="flex gap-4 items-center">
                    <Input
                      value={manualGuess}
                      onChange={(e) => setManualGuess(e.target.value)}
                      placeholder="Enter a letter"
                    />
                    <Button onClick={handleManualGuess}>Check</Button>
                  </div>
                )}
              </div>
            </>
          )}
          {gameState === "won" && (
            <>
              <h1>You Win!</h1>
              <div className="w-full mx-auto flex flex-col gap-3 justify-center items-center pt-5 ">
                <p>The word was:</p>
                <p>{currentWord}</p>
              </div>
              <CheckIcon />
              <Button
                onClick={async () => {
                  await handleKnowWord(currentWord);
                  handleNextWord();
                }}
              >
                Next Word
              </Button>
            </>
          )}
          {gameState === "lost" && (
            <>
              <h1>Game Over</h1>
              <div className="w-full mx-auto flex flex-col gap-3 justify-center items-center pt-5 ">
                <p>The word was:</p>
                <p>{currentWord}</p>
              </div>
              <HangmanDrawing nWrong={7} />{" "}
              {/* Show full drawing on game over */}
              <Button
                onClick={async () => {
                  await handleDontKnowWord(currentWord);
                  handleNextWord();
                }}
              >
                Next Word
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default HangmanGame;
