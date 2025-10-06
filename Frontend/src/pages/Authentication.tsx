import { SignedIn, SignedOut, SignIn, SignUp,  } from '@clerk/clerk-react'

const Authentication = () => {
    return (
        <div>
            <SignedOut>
                <SignIn routing='path' path='/sign-in'/>
                <SignUp routing='path' path='/sign-up'/>
            </SignedOut>
            <SignedIn>
                <div className='redirect-message'>
                    <p>Your are already Signedin</p>
                </div>
            </SignedIn>
        </div>
    )
}

export default Authentication
