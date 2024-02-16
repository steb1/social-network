import Link from "next/link";
import Logout from "./Logout";

const Header = () => {
    return (
        <header className='z-[100] h-[--m-top] fixed top-0 left-0 w-full flex items-center bg-white/80 sky-50 backdrop-blur-xl border-b border-slate-200 dark:bg-dark2 dark:border-slate-800'>
            <div className='flex items-center w-full xl:px-6 px-2 max-lg:gap-10'>
                <div className='2xl:w-[--w-side] lg:w-[--w-side-sm]'>
                    <div className='flex items-center gap-1'>
                        <button
                            uk-toggle='target: #site__sidebar ; cls :!-translate-x-0'
                            className='flex items-center justify-center w-8 h-8 text-xl rounded-full hover:bg-gray-100 xl:hidden dark:hover:bg-slate-600 group'
                        >
                            <ion-icon name='menu-outline' className='text-2xl group-aria-expanded:hidden' />
                            <ion-icon name='close-outline' className='hidden text-2xl group-aria-expanded:block' />
                        </button>
                        <Link href='/' id='logo'>
                            <h1 className='bg-clip-text text-center font-instalogo text-3xl text-black'>
                                The Social Network
                            </h1>
                        </Link>
                    </div>
                </div>
                <div className='flex-1 relative'>
                    <div className='max-w-[1220px] mx-auto flex items-center'>
                        <div className='flex items-center sm:gap-4 gap-2 absolute right-5 top-1/2 -translate-y-1/2 text-black'>
                            <Logout />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
