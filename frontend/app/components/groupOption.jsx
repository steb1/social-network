export const GroupOption = ( {group} ) => {

    return (
        <div id={group.group_id} className="card card-compact w-36 w-96 bg-base-100 shadow-xl">
            <figure><img src="https://i0.wp.com/www.iedunote.com/img/28051/reference-groups.jpg?fit=1080%2C720&quality=100&ssl=1" alt="Shoes" /></figure>
            <div className="card-body">
                <h2 className="card-title">{group.title}</h2>
                <p>{group.description}</p>
                <div className="card-actions justify-end">
                <button className="btn btn-primary">Join</button>
                </div>
            </div>
        </div>
        
    )
}


