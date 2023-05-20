import React, { Component, Fragment, useContext } from 'react'
import { useLocation, Outlet, Link, useLoaderData } from 'react-router-dom'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

import { AccountIcon } from './AccountIcon'
import { AuthForms } from './AuthForms'
import { UserContext } from '../what/login';

const user = {
  name: 'bill apple musk',
  email: 'tom@example.com',
}

const navigation = [
  { name: 'Dashboard', href: '/', current: true },
  { name: 'Playlists', href: '/playlists', current: false },
  { name: 'About', href: '/about', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const accountNavigation = [
	{ name: 'Login', href: '/login' },
	{ name: 'Register', href: '/register' },
  ]


function AccountOptions({loaderData}) {

	return ( <>
		<Menu as="div" className="relative ml-auto right-0">
		<Disclosure className="bg-gray-800" defaultOpen={loaderData.openLogin}>
			{({ open }) => ( <>
				<Disclosure.Button className={classNames(
						open
							? 'bg-gray-900 text-white'
							: 'text-gray-300 hover:bg-gray-700 hover:text-white',
						'px-3 h-full text-sm font-medium',
						'flex flex-col justify-center relative'
					)}>
					<a> Login </a>
				</Disclosure.Button>

				<Menu.Items className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					{ AuthForms() }
				</Menu.Items>
				</>
			)}
		</Disclosure>
		</Menu>
	</> )
}

export function TopNav() {
	const {pathname} = useLocation();
	const loaderData = useLoaderData() ?? {};
	const { user } = useContext(UserContext);

  	return (
		<Disclosure as="nav" className="bg-gray-800">
			{({ open }) => ( <>
				<div className="mx-auto max-w-7xl sm:px-4 lg:px-[1rem+calc((100%-1024px)*0.1)] flex flex-initial flex-shrink-0 flex-grow-0">
					<div className="flex h-12 items-center justify-between">
						<div className="flex items-center h-full">
							<div className="flex-shrink-0">
								<img
									className="h-10 w-10"
									src="https://placekitten.com/g/128/128"
									alt="Your Company"
								/>
							</div>
							<div className="md:block h-full">
								<div className="ml-4 flex h-full">
									{navigation.map((item) => (
										<React.Fragment key={item.name}>
										{
											item.current = (item.href == pathname)
										}

										<Link
											key={item.name}
											to={item.href}
											className={classNames(
												item.current
													? 'bg-gray-900 text-white'
													: 'text-gray-300 hover:bg-gray-700 hover:text-white',
												'px-3 h-full text-sm font-medium',
												'flex flex-col justify-center relative'
											)}
											aria-current={item.current ? 'page' : undefined}
										>
											{item.name}
											{
												item.current ? (
												<span key={item.name+"_rect"} className='h-[3px] absolute w-full left-0 right-0 bottom-0 bg-sky-600'></span>
												) : null
											}
										</Link>
										</React.Fragment>
									))}
								</div>
							</div>
						</div>
					</div>
					{
						user ? (<AccountIcon open={open} />) :
							(<AccountOptions loaderData={loaderData} />)
					}
				</div>
			</> )}
		</Disclosure>
	)
}