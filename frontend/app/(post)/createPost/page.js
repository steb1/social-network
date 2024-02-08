"use client";
function page() {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = document.getElementById('create-post-form')
        const NewformData = new FormData(form)
        const response = await fetch("http://localhost:8080/api/createPost", {
            method: 'POST',
            body: NewformData,
        });
        const datas = await response.json();
        if (response.ok) {
            console.log('post response:', datas);
            console.log('post sent');
        }
    };
    return (
        <div className="container">
            <form id="create-post-form" encType="multipart/form-data" onSubmit={handleSubmit} className="form">
                <h1>CreatePost</h1>
                <div>
                    <label>Title</label>
                    <input type="text" name="title" id="title" />
                </div>
                <div>
                    <label >Body</label>
                    <textarea name="body" id="body" cols={30} rows={10}></textarea>
                </div>
                <div >
                    <label>Image</label>
                    <input type="file" name="media_post" id="image" />
                </div>
                <div>
                    <label >UserId</label>
                    <input type="text" name="userId" id="userID" />
                </div>
                <div>
                <input  type="checkbox" name="category" id="Technology" value="Technology" /><label htmlFor="Technology">Technology</label>
                <input  type="checkbox" name="category" id="Health" value="Health" /><label htmlFor="Health">Health</label>
                <input  type="checkbox" name="category" id="Politic" value="Politics" /><label htmlFor="Politic">Politics</label>                   
                <input  type="checkbox" name="category" id="Sport" value="Sports" /><label htmlFor="Sport">Sports</label>
                <input  type="checkbox" name="category" id="Religion" value="Religion" /><label htmlFor="Religion">Religion</label>       
                <input  type="checkbox" name="category" id="Other" value="Others" /><label htmlFor="Other">Others</label>
                </div>
                <div>
                    <button type="submit">
                        Create
                    </button>
                </div>
            </form>
        </div>
    )
}

export default page;