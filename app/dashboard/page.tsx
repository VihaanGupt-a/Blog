import {redirect} from "next/navigation";
import {auth, signOut} from "@/auth";

export default async function DashboardPage(){
    const session = await auth();

    if(!session?.user){
        redirect("/login");
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <header className="border-b bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <h1 className="text-xl font-bold">DevBlog</h1>

                    <form
                        action={async () => {
                            "use server";
                            await signOut({redirectTo: "/login"});
                        }}
                    >   
                        <button 
                            type="submit"
                            className="rounded-md border px-4 py-2 text-sm hover:bg-gray-100">
                                Logout
                            </button>
                    </form>
                </div>
            </header>

            <div className="max-auto mx-6-xl border-8 bg-white">
                
            </div>
        </main>
    )
}