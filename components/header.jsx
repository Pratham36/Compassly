import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button'
import { FileUser, GraduationCap, LayoutDashboard, Menu, PenBox } from 'lucide-react'
import { checkUser } from '@/lib/checkUser'

export default async function Header() {
  await checkUser();
  return (
    <header className='flexed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60 ' >
      <nav className='container mx-auto px-4 h-16 flex items-center justify-between '>
        <Link href="/">
          <p className=" logo font-bold gradient-title animate-gradient h-12 py-1 pt-3 w-auto object-contain text-xl md:text-2xl lg:text-3xl" >
            COMPASSLY
          </p>
        </Link>
        <div className='flex items-center  space-x-2 md:space-x-4'>
          <SignedIn>
            <Link href={"/dashboard"} >
              <Button variant="outline">
                <LayoutDashboard className='h-4 w-4' />
                <span className='hidden md:block'>Dashboard</span>
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>

                <Button>
                  <span className='hidden md:block'>Tools</span>
                  <Menu className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href={"/resume"} className='flex items-center gap-2'>
                    <FileUser className='h-4 w-4' />
                    <span className=' md:block'>Resume Builder</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={"/ai-cover-letter"} className='flex items-center gap-2'>
                    <PenBox className='h-4 w-4' />
                    <span className=' md:block'>Cover Letter</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={"/interview"} className='flex items-center gap-2'>
                    <GraduationCap className='h-4 w-4' />
                    <span className=' md:block'>Interview Perp</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "!w-10 !h-10",
                  userButtonPopoverCard: "shadow-xl p-4 bg-white rounded-md border",
                  userPreviewMainIdentifier: "text-sm font-semibold",
                  userButtonTrigger: "hover:scale-105 transition-transform duration-200",
                },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedOut>
            <SignUpButton>
              <Button variant="default">Sign Up</Button>
            </SignUpButton>
          </SignedOut>
        </div>
      </nav>

    </header>

  )
}