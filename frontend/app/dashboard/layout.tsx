import React from 'react'

// layout file for dashbaord to contain child components 

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            {children}
        </div>
    )
}

export default Layout