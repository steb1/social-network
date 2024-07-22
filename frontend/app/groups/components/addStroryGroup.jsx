export const AddStoryGroup = () => {
    return (
        <div className="bg-white w-[33rem] mt-10 mr-auto ml-auto rounded-xl block shadow-sm md:p-4 p-2 space-y-4 text-sm font-medium border1 dark:bg-dark2">
          <div className="flex items-center md:gap-3 gap-1"> 
              <div className="flex-1 bg-slate-100 hover:bg-opacity-80 transition-all rounded-lg cursor-pointer dark:bg-dark3" uk-toggle="target: #create-statusGroup"> 
              <div className="py-2.5 text-center dark:text-white"> What do you have in mind? </div>
              </div>
              <div className="cursor-pointer hover:bg-opacity-80 p-1 px-1.5 rounded-xl transition-all bg-pink-100/60 hover:bg-pink-100 dark:bg-white/10 dark:hover:bg-white/20" uk-toggle="target: #create-statusGroup">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 stroke-pink-600 fill-pink-200/70" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M15 8h.01" />
                  <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" />
                  <path d="M3.5 15.5l4.5 -4.5c.928 -.893 2.072 -.893 3 0l5 5" />
                  <path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l2.5 2.5" />
              </svg>
              </div>
              
          </div>

      </div>

    )
}
