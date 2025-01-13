import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { CalendarIcon, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddBlogPostFormProps {
  onClose: () => void;
}

const AddBlogPostForm: React.FC<AddBlogPostFormProps> = ({ onClose }) => {
  const { data: session } = useSession();
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [stateOfMind, setStateOfMind] = useState("positive");
  const [blogType, setBlogType] = useState<"spontan" | "refleksion">("spontan");

  const handleAddBlog = async () => {
    if (!session) return;
    try {
      const formattedDate = format(date, "yyyy-MM-dd", { locale: da });
      const newBlog = {
        title: newTitle,
        content: newContent.replace(/\n/g, '\n\n'), // Replace single newlines with double newlines
        createdAt: formattedDate,
        updatedAt: formattedDate,
        type: blogType,
        stateOfMind: stateOfMind,
      };
      await addDoc(collection(db, "blogs"), newBlog);
      setNewTitle("");
      setNewContent("");
      setDate(new Date());
      setStateOfMind("neutral");
      setBlogType("spontan");
      onClose();
    } catch (error) {
      console.error("Error adding blog: ", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg mb-4">
        <Button
          variant={blogType === "spontan" ? "default" : "ghost"}
          className={cn(
            "w-full",
            blogType === "spontan" && "shadow-sm"
          )}
          onClick={() => setBlogType("spontan")}
        >
          Spontanlog
        </Button>
        <Button
          variant={blogType === "refleksion" ? "default" : "ghost"}
          className={cn(
            "w-full",
            blogType === "refleksion" && "shadow-sm"
          )}
          onClick={() => setBlogType("refleksion")}
        >
          Refleksionslog
        </Button>
      </div>
      <Input
        type="text"
        placeholder="Titel"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      />
      <Textarea
        placeholder="Indhold"
        value={newContent}
        onChange={(e) => setNewContent(e.target.value)}
        className="min-h-[300px] whitespace-pre-wrap"
      />
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold">Dato</h4>
          <span className="text-sm text-muted-foreground">
            {format(date, "dd/MM/yyyy", { locale: da })}
          </span>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("w-full justify-start text-left font-normal")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(date, "dd/MM/yyyy", { locale: da })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => setDate(newDate || new Date())}
              initialFocus
              locale={da}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="mb-2">
        <div className="flex items-center gap-2 p-1">
          <h4 className="text-sm font-semibold">State of Mind</h4>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Hvordan jeg føler jeg har haft det på dagen...</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-lg">
          <Button
            variant={stateOfMind === "positive" ? "default" : "ghost"}
            className={cn(
              "w-full",
              stateOfMind === "positive" &&
                "shadow-sm bg-green-500 hover:bg-green-600"
            )}
            onClick={() => setStateOfMind("positive")}
          >
            Positiv
          </Button>
          <Button
            variant={stateOfMind === "neutral" ? "default" : "ghost"}
            className={cn(
              "w-full",
              stateOfMind === "neutral" &&
                "shadow-sm bg-yellow-500 hover:bg-yellow-600"
            )}
            onClick={() => setStateOfMind("neutral")}
          >
            Neutral
          </Button>
          <Button
            variant={stateOfMind === "negative" ? "default" : "ghost"}
            className={cn(
              "w-full",
              stateOfMind === "negative" &&
                "shadow-sm bg-red-500 hover:bg-red-600"
            )}
            onClick={() => setStateOfMind("negative")}
          >
            Negativ
          </Button>
        </div>
      </div>
      <Button onClick={handleAddBlog} className="w-full">
        Tilføj post
      </Button>
    </div>
  );
};

export default AddBlogPostForm;
