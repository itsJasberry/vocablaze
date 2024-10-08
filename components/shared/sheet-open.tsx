"use client";

import { useState } from "react";
import { getTextColor, hexToRgb } from "@/helpers/file";
import { FolderType, IWordSetType } from "@/types";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import WordSetsList from "./wordset-list";
import { FcFolder, FcOpenedFolder } from "react-icons/fc";

const SheetOpen = ({
  folder,
  wordSets,
}: {
  folder: FolderType;
  wordSets: IWordSetType[];
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const wordSetsFilter = wordSets.filter((wordSet) =>
    wordSet?.folders?.some((folderItem) => folderItem.id === folder.id)
  );
  


  const handleFolderClick = () => {
    setOpen(true);
  };

  const handleCloseSheet = () => {
    setOpen(false);
  };

  const handleOpenDrawer = (isOpen: boolean) => {
    if (!isOpen) {
      handleCloseSheet();
    }
  };

  return (
    <>
      <li
        key={folder.id}
        className={cn(
          "h-28 w-32 flex justify-end items-center flex-col hover:opacity-80 rounded-md cursor-pointer shadow-xl"
        )}
        style={{
          backgroundColor: `${hexToRgb(folder?.color as string)}`,
        }}
        onClick={() => handleFolderClick()}
      >
        {wordSetsFilter.length > 0 ? (
          <FcOpenedFolder className="w-10 h-10 mb-3"/>
        ) : (
          <FcFolder className="w-10 h-10 mb-3"/>
        )}
        <div
          className="px-2 text-xl font-bold truncate text-center text-white bg-black/60 rounded-b-md w-full"
        >
          {folder.name}
        </div>
      </li>
      {isDesktop ? (
        <Sheet open={open} onOpenChange={handleCloseSheet}>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle className="text-2xl font-bold">{folder?.name}</SheetTitle>
                {wordSetsFilter.length > 0 ? (
                  <WordSetsList wordSets={wordSetsFilter} className="h-[90dvh]" liStyle="mx-0 bg-black/10 mr-6" />
                ) : (
                  <span>No word sets found in this folder</span>
                )}
   
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ) : (
        <Drawer open={open} onOpenChange={handleOpenDrawer}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{folder?.name}</DrawerTitle>
              <DrawerDescription>
                <>
                  <span>Folder ID: {folder?.id}</span>
                  {wordSetsFilter.length > 0 ? (
                    <WordSetsList wordSets={wordSetsFilter} liStyle="mx-0 bg-black/10 mr-6" />
                  ) : (
                    <span>No word sets found in this folder</span>
                  )}
                </>
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default SheetOpen;
