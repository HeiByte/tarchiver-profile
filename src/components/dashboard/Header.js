export default function Header({ title }){
    return(
        <div className="text-black p-5">
            <h1 className="text-2xl font-bold">{title || "Welcome To Tarchiver Lite"}</h1>
        </div>
    )
}