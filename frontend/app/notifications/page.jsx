import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import authMiddleware from "@/middleware/authMiddleware";
import config from "@/config";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
const people = [
    {
        name: "Leslie Alexander",
        email: "leslie.alexander@example.com",
        role: "Co-Founder / CEO",
        imageUrl:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        lastSeen: "3h ago",
        lastSeenDateTime: "2023-01-23T13:23Z",
    },
    {
        name: "Michael Foster",
        email: "michael.foster@example.com",
        role: "Co-Founder / CTO",
        imageUrl:
            "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        lastSeen: "3h ago",
        lastSeenDateTime: "2023-01-23T13:23Z",
    },
    {
        name: "Dries Vincent",
        email: "dries.vincent@example.com",
        role: "Business Relations",
        imageUrl:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        lastSeen: null,
    },
    {
        name: "Lindsay Walton",
        email: "lindsay.walton@example.com",
        role: "Front-end Developer",
        imageUrl:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        lastSeen: "3h ago",
        lastSeenDateTime: "2023-01-23T13:23Z",
    },
    {
        name: "Courtney Henry",
        email: "courtney.henry@example.com",
        role: "Designer",
        imageUrl:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        lastSeen: "3h ago",
        lastSeenDateTime: "2023-01-23T13:23Z",
    },
    {
        name: "Tom Cook",
        email: "tom.cook@example.com",
        role: "Director of Product",
        imageUrl:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        lastSeen: null,
    },
];

async function Notifications() {
    const cookieStore = cookies();
    let persons;
    try {
        const response = await fetch(`${config.serverApiUrl}pendingrequests`, {
            method: "GET",
            headers: {
                Authorization: cookieStore.get("social-network").value,
            },
        });

        if (response.ok) {
            persons = await response.json();
        } else {
            return notFound();
        }
    } catch {
        return notFound();
    }

    return (
        <div id='wrapper' className='h-full flex flex-col'>
            <Header />
            {/* Fixed Sidebar */}
            <div className='flex flex-row'>
                <div
                    className=' ml-2 left-0 max-sm:hidden max-md:hidden max-lg:hidden  overflow-y-visible touch-none h-80'
                    uk-sticky=''
                >
                    <Sidebar />
                </div>
                <div className=' mx-auto mt-20 w-auto flex flex-col'>
                    <ul role='list' className=' divide-gray-100'>
                        {persons.map((person) => (
                            <li key={person.email} className='flex justify-center mt-2 flex-col  gap-6'>
                                <div className='flex min-w-0 gap-x-4'>
                                    <img
                                        className='h-12 w-12 flex-none rounded-full bg-gray-50'
                                        src={`http://localhost:8080/img/${person.avatar}`}
                                        alt='Avatar'
                                    />
                                    <div className='min-w-0 my-auto flex-auto'>
                                        <p>
                                            {person.first_name} {person.last_name} wants to follow you.
                                        </p>
                                    </div>
                                    <div className='flex flex-row gap-4'>
                                        <button className='btn btn-circle bg-slate-300 hover:bg-green-700 btn-xs sm:btn-sm md:btn-md lg:btn-md text-white'>
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                width='32'
                                                height='32'
                                                viewBox='0 0 48 48'
                                            >
                                                <path
                                                    fill='#ffffff'
                                                    fillRule='evenodd'
                                                    stroke='fffffff'
                                                    stroke-linecap='round'
                                                    stroke-linejoin='round'
                                                    stroke-width='4'
                                                    d='m4 24l5-5l10 10L39 9l5 5l-25 25z'
                                                    clipRule='evenodd'
                                                ></path>
                                            </svg>
                                        </button>
                                        <button className='btn btn-circle bg-slate-300 hover:bg-red-700 btn-xs sm:btn-sm md:btn-md lg:btn-md text-white'>
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                width='32'
                                                height='32'
                                                viewBox='0 0 24 24'
                                            >
                                                <path
                                                    fill='#ffffff'
                                                    d='m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275q-.275-.275-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275q.275.275.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7q-.275.275-.7.275t-.7-.275z'
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
export default authMiddleware(Notifications, config.serverApiUrl + "checkAuth");
