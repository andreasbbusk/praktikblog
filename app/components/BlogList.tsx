"use client";

import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import Modal from "./Modal";
import AlertDialog from "./AlertDialog";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarIcon } from "lucide-react";
import { format, getWeek, startOfWeek, endOfWeek } from "date-fns";
import { da } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Blog {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  type: "spontan" | "refleksion";
  stateOfMind: string;
  reflectionContent?: string;
  weekNumber?: number;
}

interface BlogListProps {
  sortBy: string;
}

const BlogList: React.FC<BlogListProps> = ({ sortBy: initialSortBy }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState(initialSortBy);

  const formatDate = (timestamp: string | number | Date) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return "Ugyldig dato";
    }
    return format(date, "d. MMMM yyyy", { locale: da });
  };

  const getWeekDateRange = (
    weekNumber: number,
    year = new Date().getFullYear()
  ) => {
    const date = new Date(year, 0, 1 + (weekNumber - 1) * 7);
    const monday = startOfWeek(date, { locale: da, weekStartsOn: 1 });
    const sunday = endOfWeek(date, { locale: da, weekStartsOn: 1 });
    return `${format(monday, "d. MMMM", { locale: da })} - ${format(
      sunday,
      "d. MMMM",
      { locale: da }
    )}`;
  };

  const getStateOfMindColor = (stateOfMind: string) => {
    switch (stateOfMind) {
      case "positive":
        return "bg-green-500 hover:bg-green-600";
      case "neutral":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "negative":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getStateOfMindInDanish = (stateOfMind: string) => {
    switch (stateOfMind) {
      case "positive":
        return "Positiv";
      case "neutral":
        return "Neutral";
      case "negative":
        return "Negativ";
      default:
        return stateOfMind;
    }
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      const querySnapshot = await getDocs(collection(db, "blogs"));
      const blogsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const timestamp =
          data.createdAt instanceof Date
            ? data.createdAt
            : new Date(data.createdAt);

        return {
          id: doc.id,
          ...data,
          createdAt: timestamp.toISOString(),
          type: data.type as "spontan" | "refleksion",
          stateOfMind: data.stateOfMind,
          reflectionContent: data.reflectionContent,
          weekNumber: getWeek(timestamp, { locale: da }),
        };
      }) as Blog[];

      const sortedBlogs = [...blogsData];

      // Debugging: Log sortBy value
      console.log("Sorting by:", sortBy);

      // Sort blogs based on createdAt date
      sortedBlogs.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        if (sortBy === "newest") {
          return dateB - dateA;
        } else if (sortBy === "oldest") {
          return dateA - dateB;
        } else if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });

      setBlogs(sortedBlogs);
    };

    fetchBlogs();
  }, [sortBy]);

  const handleBlogClick = (blog: Blog) => {
    setSelectedBlog(blog);
  };

  const closeModal = () => {
    setSelectedBlog(null);
  };

  // Group blogs by week
  const groupedBlogs = blogs.reduce((acc, blog) => {
    const weekNumber = blog.weekNumber || 0;
    if (!acc[weekNumber]) {
      acc[weekNumber] = [];
    }
    acc[weekNumber].push(blog);
    return acc;
  }, {} as Record<number, Blog[]>);

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sortér efter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Nyeste først</SelectItem>
            <SelectItem value="oldest">Ældste først</SelectItem>
            <SelectItem value="title">Titel (A-Å)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <AlertDialog
        isOpen={isDialogOpen}
        onConfirm={() => {
          if (blogToDelete) {
            setBlogToDelete(null);
          }
          setDialogOpen(false);
        }}
        onCancel={() => setDialogOpen(false)}
        message="Sikker på at du vil fortsætte?"
      />
      {Object.entries(groupedBlogs)
        .sort(([weekA], [weekB]) => Number(weekA) - Number(weekB))
        .map(([weekNumber, weekBlogs]) => (
          <div key={weekNumber} className="mb-8">
            <h2 className="text-2xl font-bold mb-1">Uge {weekNumber}</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {getWeekDateRange(Number(weekNumber))}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {weekBlogs.map((blog) => (
                <Card
                  key={blog.id}
                  className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => handleBlogClick(blog)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge
                                variant="default"
                                className="mb-2 uppercase"
                              >
                                {blog.type === "spontan"
                                  ? "spontanlog"
                                  : blog.type}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Type af indlæg</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        {blog.reflectionContent && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge
                                  variant="default"
                                  className="mb-2 uppercase"
                                >
                                  Refleksionslog
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Dette indlæg indeholder refleksioner</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge
                                variant="default"
                                className={cn(
                                  "mb-2",
                                  getStateOfMindColor(blog.stateOfMind)
                                )}
                              >
                                {getStateOfMindInDanish(blog.stateOfMind)}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Sindstilstand under skrivning</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    <CardTitle className="text-xl mb-2">{blog.title}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {blog.content}
                    </p>
                  </CardHeader>
                  <CardFooter className="flex justify-between items-center pt-4">
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <CalendarIcon className="h-3 w-3" />
                      {formatDate(blog.createdAt)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-secondary"
                      onClick={() => handleBlogClick(blog)}
                      aria-label="Læs mere"
                    >
                      <ArrowRight className="h-4 w-4 -rotate-45" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ))}
      {selectedBlog && (
        <Modal
          isOpen={!!selectedBlog}
          onClose={closeModal}
          blog={selectedBlog}
        />
      )}
    </div>
  );
};

export default BlogList;
