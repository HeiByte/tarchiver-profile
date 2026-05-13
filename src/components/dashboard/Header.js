export default function Header({ title }){
    return(
        <div className="text-black p-2">
            <h1 className="text-lg font-bold">{title || "Welcome To Tarchiver Lite"}</h1>
        </div>
    )
}