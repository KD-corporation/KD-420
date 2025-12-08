//this is feature page where all feature will be displayed
"use client"


export const Features = () => {
    
    return(
        <div>
            <div className="flex"> 
                <div className="">
                    <a href="/Game/mazeExplorer">Maze Explorer</a>
                </div>
                <div>
                    <a href="/test">Bubble Select</a>
                </div>
                <div>
                    <a href="/Game/Arrange-queries"> Arrange The Query</a>
                </div>
            </div>
            <div>
                <div> Search feature</div>
                <div>
                    <select className="bg-base-100 border-green-600 focus-visible:">
                        <option className="text-white bg-base-100 select-color-green"
                        value={}
                        >Easy</option>
                        <option className="text-white bg-base-100 select-color-green">Medium</option>
                        <option className="text-white bg-base-100 select-color-green">Hard</option>
                    </select>
                </div>
            </div>
            <div>
                by default render the question fetched by database via pagination

                if question is searched then render the serached question
                or if aplied filter then render the fi;tered question
            </div>
        </div>
    )
}