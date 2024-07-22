export const Members = ({ member }) => {
    return (
        <div className="flex flex-row gap-2">
            <div className="flex flex-row h-16 px-1 dark:bg-slate-800 bg-white gap-3 w-[30rem] border-2 items-center rounded-2xl ">
                <div className="w-9 h-9 rounded-full mr-7" >
                    <img src={ !member.avatar ?  "../assets/images/avatars/avatar-5.jpg" : member.avatar } className="rounded-full ml-2" alt="" />
                </div>
                <div className="w-80 ">
                    <p> { member ? (member.first_name + " " + member.last_name + " (" + member.nickname + ")" ) : "" } </p>
                </div>
            </div>
            <div className="flex flex-row w-10 h-10 px-1 my-auto gap-3  items-center rounded-full" >
                
            </div>
        </div>
    )
}