"use client";

import { Button } from "@/components/ui/button";
import AuthContext from "@/providers/AuthContext";
import { useContext } from "react";
const SignOut = () => {

    const { logOut } = useContext(AuthContext);

    return <Button onClick={() => logOut()}>
        Sign Out
    </Button>;
};

export default SignOut;
