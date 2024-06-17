"use client";

import React, { useState } from "react";
import { AddFolderSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Spinner, Tooltip } from "@nextui-org/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CustomModalProps {
  triggerIcon: React.ReactNode;
  title: string;
  description: string;
  handleClick: (values: z.infer<typeof AddFolderSchema>) => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  triggerIcon,
  title,
  description,
  handleClick,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof AddFolderSchema>>({
    resolver: zodResolver(AddFolderSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof AddFolderSchema>> = async (
    values
  ) => {
    setIsLoading(true);
    try {
      await handleClick(values);
      toast.success("Folder added successfully!");
    } catch (error) {
      toast.error("Failed to add folder.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog>
      <Tooltip content="Add a folder">
        <DialogTrigger asChild>
          <Button isIconOnly variant="flat">
            {triggerIcon}
          </Button>
        </DialogTrigger>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <Input label="Folder Name" id="name" {...register("name")} />
            {errors.name && <span>{errors.name.message}</span>}
          </div>
          <Button
            color="success"
            className="font-bold"
            type="submit"
            variant="shadow"
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : "Create"}
          </Button>{" "}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
