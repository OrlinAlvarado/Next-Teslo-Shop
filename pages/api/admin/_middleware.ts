import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt'

export async function middleware( req: NextRequest, ev: NextFetchEvent ) {
    
    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET } );
    
    const response = new Response(JSON.stringify({ message: 'No autorizado'}), { 
        status: 401,
        headers: { 
            'Content-Type': 'application/json' 
        } 
    });
    
    if ( !session ) { 
        return response
    }
    
    const validRoles = ['admin', 'super-admin', 'SEO'];
    
    if ( !validRoles.includes(session.user.role) ) {
        return response
    }
    
    return NextResponse.next();
    
}