import React from "react";
import { Button } from "@nextui-org/button";

import MobileNavbar from "@/components/shared/navbar/navbar";
import Search from "@/components/shared/search";

import FoldersList from "../../../components/shared/folder-list";
import { LineChart } from "../../../components/shared/line-chart-icon";
import WordSetsList from "../../../components/shared/wordset-list";
import { getAllWordSets, getFolders } from "@/lib/data/rest";

export default async function Page() {
  const [wordSetsResponse, folders] = await Promise.all([getAllWordSets(), getFolders()]);
  const { wordSets, error } = wordSetsResponse;

  return (
    <>
      <div className="relative flex flex-col w-full justify-center xl:px-0">
        <div className="flex flex-col lg:flex-row w-full gap-4">
          <div className="flex flex-col lg:w-1/3 gap-4">
            <section className="rounded-lg bg-black/5 backdrop-blur-xl shadow-md">
              <span className="flex justify-between p-5">
                <span className="text-2xl font-bold">🌍Latest learning</span>
                <Search queryKey="sets"/>
              </span>
              <WordSetsList wordSets={wordSets} error={error as string}/>
            </section>
            <section className="hidden lg:block relative p-5 bg-black/5 backdrop-blur-xl shadow-md rounded-lg dark:bg-gray-700">
              <span className="text-2xl font-bold"> 💲Premium Access</span>
              <p className="text-gray-600 dark:text-gray-400">
                Unlock all language games and features with a Premium
                subscription.
              </p>
              <div className="w-full flex justify-end">
                <Button
                  className="border-black text-black hover:bg-black hover:text-white font-bold px-4 rounded-lg transition-colors duration-300 mt-3"
                  variant="flat"
                >
                  Upgrade to Premium
                </Button>
              </div>
            </section>
          </div>
          <div className="flex flex-col lg:w-2/3 gap-4">
            <section className="hidden lg:block relative h-full max-h-[350px] w-full bg-black/5 backdrop-blur-xl shadow-md p-5 rounded-lg">
              <span className="text-2xl font-bold">
                📚Your learning history
              </span>
            </section>
            <section className="flex flex-col lg:flex-row gap-4 h-full ">
              <div className="relative h-full w-full lg:w-1/2 gap-4 ">
                <div className="hidden lg:flex justify-around flex-col p-5 h-full bg-black/5 backdrop-blur-xl shadow-md rounded-lg">
                  <span className="text-2xl font-bold">📈 Monthly trends</span>
                  <div className="dark:bg-gray-800 rounded-lg p-6">
                    {/* <LineChart className="h-[130px]" /> */}
                    Chart
                  </div>
                  <div className="w-full flex justify-center">
                    <Button
                      className="border-black text-black hover:bg-black hover:text-white font-bold px-4 rounded-lg transition-colors duration-300 mt-3"
                      variant="flat"
                    >
                      Check out more ➡️
                    </Button>
                  </div>
                </div>
              </div>
              <div className="relative w-full lg:w-1/2">
                <div className="relative h-full p-5 bg-black/5 backdrop-blur-xl shadow-md rounded-lg">
                  <span className="flex justify-between">
                    <span className="text-2xl font-bold">📁Folders</span>
                    <Search queryKey="folders"/>
                  </span>
                  <div className="flex flex-wrap w-full gap-4 mt-4">
                    <FoldersList folders={folders}/>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};