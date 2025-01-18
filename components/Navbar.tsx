import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LoginButton from "@/app/components/LoginButton";

export default function Navbar() {
  const pathname = usePathname();

  const defaultTab =
    pathname === "/laeringsmaal" ? "laeringsmaal" : "udvikling";

  return (
    <div className="sticky top-0 pt-4 z-50">
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="w-[90%] h-20 flex items-center border border-gray-200 rounded-lg bg-white/10 backdrop-blur-md shadow-lg supports-[backdrop-filter]:bg-white/10 mx-auto">
          <div className="flex-1" />
          <div className="flex justify-center gap-4 flex-1">
            <Link href="/">
              <TabsTrigger
                value="udvikling"
                className="text-xl font-medium hover:text-primary transition-colors px-6 py-3"
              >
                Refleksioner & udvikling
              </TabsTrigger>
            </Link>   
            <Link href="/laeringsmaal">
              <TabsTrigger
                value="laeringsmaal"
                className="text-xl font-medium hover:text-primary transition-colors px-6 py-3"
              >
                Læringsmål
              </TabsTrigger>
            </Link>
          </div>
          <div className="flex-1 flex justify-end mr-8">
            <LoginButton />
          </div>
        </TabsList>
      </Tabs>
    </div>
  );
}
