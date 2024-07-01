import React from "react";

import { getFolders, getLanguages } from "@/lib/data/rest";
import { CardComponent } from "@/components/ui/Card/Card";

const Add = async () => {
  const languages = getLanguages();
  const folders = getFolders();

  const [lang, fold] = await Promise.all([languages, folders]);

  console.log("folders", fold);
  return (
    <div className="border-none flex justify-center">
      <CardComponent
        mode="add"
        languages={lang}
        folders={fold}
        text="Create a new word set"
      />
    </div>
  );
};

export default Add;
