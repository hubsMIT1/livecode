import { useState } from "react"
import LInput from "./ui/Input"
import { useNavigate } from "react-router-dom"
import ButtonUI from "./Button";

export default function ConnectViaLink() {
    const navigate = useNavigate();
    const [link,setLink] = useState<string>('')
    const [errors, setErrors] = useState({
        link: "",})
    return (
        <div className="flex md:flex-col gap-5 justify-center h-[200px] items-center ">
            {/* <h1 className="text-center"> Topics </h1> */}
            <div className="w-80">

            <LInput
                label="Enter join link code"
                name="link"
                type="text"
                handleChange={(e: React.ChangeEvent<HTMLInputElement>)=>setLink(e.target.value)}
                value={link}
                errors={errors}
                handleIcon={() => { }}
                />
                </div>
            <div className="relative top-3">
            <ButtonUI title="Go" handleSubmit={() => { if(link.length>0) navigate(`/contest/pre/${link}`)
            else {
                setErrors({link:'Please enter a valid join id!'})
            }}} />

            </div>
        </div>
    )
}