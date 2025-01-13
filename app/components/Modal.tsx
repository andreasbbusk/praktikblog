import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, Pencil, Trash2, CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { db } from "../../firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog: {
    id?: string;
    title: string;
    content: string;
    createdAt: string;
    type: "spontan" | "refleksion";
    stateOfMind: string;
    reflectionContent?: string;
    spontaneousContent?: string;
  };
  onDelete?: () => void;
  onUpdate?: (blog: {
    title: string;
    content: string;
    type: "spontan" | "refleksion";
    stateOfMind: string;
    createdAt: string;
    reflectionContent?: string;
    spontaneousContent?: string;
  }) => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  blog,
  onDelete,
  onUpdate,
}) => {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(blog.title);
  const [editedContent, setEditedContent] = useState(blog.content);
  const [editedReflectionContent, setEditedReflectionContent] = useState(blog.reflectionContent || "");
  const [editedSpontaneousContent, setEditedSpontaneousContent] = useState(blog.spontaneousContent || "");
  const [editedType, setEditedType] = useState<"spontan" | "refleksion">(blog.type);
  const [editedStateOfMind, setEditedStateOfMind] = useState(blog.stateOfMind);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showReflectionEditor, setShowReflectionEditor] = useState(false);
  const [showSpontaneousEditor, setShowSpontaneousEditor] = useState(false);
  const [date, setDate] = useState<Date | undefined>(() => {
    const [day, month, year] = blog.createdAt.split("/");
    const parsedDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day)
    );
    return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
  });

  const handleSave = async () => {
    if (!blog.id || !session) {
      toast({
        variant: "destructive", 
        description: "Du skal være logget ind for at gemme ændringer."
      });
      return;
    }

    if (!editedTitle.trim()) {
      toast({
        variant: "destructive",
        description: "Titlen må ikke være tom."
      });
      return;
    }

    try {
      setIsLoading(true);
      const formattedDate = date
        ? format(date, "yyyy-MM-dd", { locale: da })
        : blog.createdAt;
      
      const updatedBlog = {
        title: editedTitle.trim(),
        content: editedContent.trim(),
        type: editedType,
        stateOfMind: editedStateOfMind,
        createdAt: formattedDate,
        updatedAt: new Date().toISOString(),
        reflectionContent: editedReflectionContent.trim(),
        spontaneousContent: editedSpontaneousContent.trim(),
      };

      const blogRef = doc(db, "blogs", blog.id);
      await updateDoc(blogRef, updatedBlog);

      if (onUpdate) {
        onUpdate(updatedBlog);
      }
      
      setIsEditing(false);
      setShowReflectionEditor(false);
      setShowSpontaneousEditor(false);
      
      toast({
        description: "Dine ændringer er blevet gemt.",
      });
    } catch (error) {
      console.error("Error updating blog:", error);
      toast({
        variant: "destructive",
        description: "Der opstod en fejl under gemning af ændringer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedTitle(blog.title);
    setEditedContent(blog.content);
    setEditedReflectionContent(blog.reflectionContent || "");
    setEditedSpontaneousContent(blog.spontaneousContent || "");
    setEditedType(blog.type);
    setEditedStateOfMind(blog.stateOfMind);
    const [day, month, year] = blog.createdAt.split("/");
    setDate(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
    setIsEditing(false);
    setShowReflectionEditor(false);
    setShowSpontaneousEditor(false);
  };

  const handleDelete = async () => {
    if (!blog.id || !session) {
      toast({
        variant: "destructive",
        description: "Du skal være logget ind for at slette indlægget."
      });
      return;
    }

    try {
      setIsLoading(true);
      const blogRef = doc(db, "blogs", blog.id);
      await deleteDoc(blogRef);

      if (onDelete) {
        onDelete();
      }
      onClose();
      toast({
        description: "Dit indlæg er blevet slettet.",
      });
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast({
        variant: "destructive",
        description: "Der opstod en fejl under sletning af indlægget.",
      });
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const getStateOfMindColor = (stateOfMind: string) => {
    switch (stateOfMind) {
      case "positive":
        return "text-green-500";
      case "neutral":
        return "text-yellow-500";
      case "negative":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStateOfMindInDanish = (stateOfMind: string) => {
    switch (stateOfMind) {
      case "positive":
        return "Positivt";
      case "neutral":
        return "Neutralt";
      case "negative":
        return "Negativt";
      default:
        return stateOfMind;
    }
  };

  const formatDate = (timestamp: string | number | Date) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return "Ugyldig dato";
    }
    return format(date, "d. MMMM yyyy", { locale: da });
  };

  const handleAddReflection = () => {
    if (!session) {
      toast({
        variant: "destructive",
        description: "Du skal være logget ind for at tilføje en refleksion."
      });
      return;
    }
    setShowReflectionEditor(true);
  };

  const handleAddSpontaneous = () => {
    if (!session) {
      toast({
        variant: "destructive",
        description: "Du skal være logget ind for at tilføje en spontan tanke."
      });
      return;
    }
    setShowSpontaneousEditor(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-full max-w-6xl p-16">
          <DialogHeader>
            <div className="flex justify-between items-center mb-4">
              {isEditing ? (
                <div className="grid grid-cols-2 gap-2 bg-muted rounded-lg flex-grow">
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 bg-muted rounded-lg flex-grow">
                </div>
              )}
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              {isEditing ? (
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="text-4xl font-bold"
                  placeholder="Indtast titel..."
                  disabled={isLoading}
                />
              ) : (
                <DialogTitle className="text-4xl font-bold">
                  {blog.title}
                </DialogTitle>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {blog.type === "spontan" ? "Spontanlog" : "Refleksionslog"}
                </h3>
                {isEditing ? (
                  <div className="h-[400px] overflow-y-auto scrollbar-hide">
                    <Textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="min-h-full text-base resize-y border border-gray-200 rounded-md"
                      placeholder="Skriv dit indhold her..."
                      disabled={isLoading}
                    />
                  </div>
                ) : (
                  <div className="h-[400px] overflow-y-auto scrollbar-hide">
                    <DialogDescription className="text-base text-black relative group min-h-full border border-gray-200 rounded-md p-4 whitespace-pre-line">
                      {blog.content || (
                        <Button
                          variant="ghost"
                          className="absolute inset-0 w-full h-full flex items-center justify-center text-muted-foreground hover:text-primary"
                          onClick={() => setIsEditing(true)}
                          disabled={isLoading}
                        >
                          Klik her for at tilføje indhold
                        </Button>
                      )}
                    </DialogDescription>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {blog.type === "spontan" ? "Refleksionslog" : "Spontanlog"}
                </h3>
                {blog.type === "spontan" ? (
                  (isEditing || showReflectionEditor) ? (
                    <div className="h-[400px] overflow-y-auto scrollbar-hide">
                      <Textarea
                        value={editedReflectionContent}
                        onChange={(e) => setEditedReflectionContent(e.target.value)}
                        className="min-h-full text-base resize-y border border-gray-200 rounded-md"
                        placeholder="Skriv din refleksion her..."
                        disabled={isLoading}
                      />
                    </div>
                  ) : (
                    <div className="h-[400px] overflow-y-auto scrollbar-hide">
                      <DialogDescription className="text-base text-black relative group min-h-full border border-gray-200 rounded-md p-4 whitespace-pre-line">
                        {blog.reflectionContent ? (
                          blog.reflectionContent
                        ) : (
                          <Button
                            variant="ghost"
                            className="absolute inset-0 w-full h-full flex items-center justify-center text-muted-foreground hover:text-primary"
                            onClick={handleAddReflection}
                            disabled={isLoading}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Tilføj refleksion
                          </Button>
                        )}
                      </DialogDescription>
                    </div>
                  )
                ) : (
                  (isEditing || showSpontaneousEditor) ? (
                    <div className="h-[400px] overflow-y-auto scrollbar-hide">
                      <Textarea
                        value={editedSpontaneousContent}
                        onChange={(e) => setEditedSpontaneousContent(e.target.value)}
                        className="min-h-full text-base resize-y border border-gray-200 rounded-md"
                        placeholder="Skriv din spontane tanke her..."
                        disabled={isLoading}
                      />
                    </div>
                  ) : (
                    <div className="h-[400px] overflow-y-auto scrollbar-hide">
                      <DialogDescription className="text-base text-black relative group min-h-full border border-gray-200 rounded-md p-4 whitespace-pre-line">
                        {blog.spontaneousContent ? (
                          blog.spontaneousContent
                        ) : (
                          <Button
                            variant="ghost"
                            className="absolute inset-0 w-full h-full flex items-center justify-center text-muted-foreground hover:text-primary"
                            onClick={handleAddSpontaneous}
                            disabled={isLoading}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Tilføj spontan tanke
                          </Button>
                        )}
                      </DialogDescription>
                    </div>
                  )
                )}
              </div>
            </div>
            <Separator />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold mb-1">State of Mind</h4>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 mb-1" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Hvordan jeg føler jeg har haft det på dagen...</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              {isEditing ? (
                <div className="grid grid-cols-3 gap-2 bg-muted rounded-lg">
                  <Button
                    variant={
                      editedStateOfMind === "positive" ? "default" : "ghost"
                    }
                    className={cn(
                      "w-full",
                      editedStateOfMind === "positive" &&
                        "shadow-sm bg-green-500 hover:bg-green-600"
                    )}
                    onClick={() => setEditedStateOfMind("positive")}
                  >
                    Positivt
                  </Button>
                  <Button
                    variant={
                      editedStateOfMind === "neutral" ? "default" : "ghost"
                    }
                    className={cn(
                      "w-full",
                      editedStateOfMind === "neutral" &&
                        "shadow-sm bg-yellow-500 hover:bg-yellow-600"
                    )}
                    onClick={() => setEditedStateOfMind("neutral")}
                  >
                    Neutralt
                  </Button>
                  <Button
                    variant={
                      editedStateOfMind === "negative" ? "default" : "ghost"
                    }
                    className={cn(
                      "w-full",
                      editedStateOfMind === "negative" &&
                        "shadow-sm bg-red-500 hover:bg-red-600"
                    )}
                    onClick={() => setEditedStateOfMind("negative")}
                  >
                    Negativt
                  </Button>
                </div>
              ) : (
                <p className={getStateOfMindColor(blog.stateOfMind)}>
                  {getStateOfMindInDanish(blog.stateOfMind)}
                </p>
              )}
            </div>
            <Separator />
            <div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 mb-1" />
                <h4 className="text-sm font-semibold mb-1">Dato</h4>
              </div>
              {isEditing ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? (
                        format(date, "yyyy-MM-dd", { locale: da })
                      ) : (
                        <span>Vælg en dato</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      locale={da}
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                <p className="text-base text-gray-600">
                  {formatDate(blog.createdAt)}
                </p>
              )}
            </div>
            {(!isEditing && !showReflectionEditor && !showSpontaneousEditor) && session && (
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsEditing(!isEditing)}
                  className="h-8 w-8"
                  disabled={isLoading}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="h-8 w-8"
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
            {(isEditing || showReflectionEditor || showSpontaneousEditor) && (
              <div className="flex justify-start gap-4">
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? "Gemmer..." : "Gem"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Annuller
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
            <AlertDialogDescription>
              Denne handling kan ikke fortrydes. Dette vil permanent slette dit
              indlæg.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isLoading}
            >
              Annuller
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Sletter..." : "Slet"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Toaster />
    </>
  );
};

export default Modal;
