import { Fragment, Component } from 'react'
import { useLocation, Outlet, Link } from 'react-router-dom'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'


const userNavigation = [
	{ name: 'Your Profile', href: '#' },

	{ name: 'Settings', href: '#' },

	{ name: 'Sign out', href: '#', onClick: (userActions) => {
	  userActions.reqLogout();
	} },
  ]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export class AccountIcon extends Component {
	render() {
		const userActions = this.props.userActions;
		const {user} = userActions;

		return (
			<>
				<div className="mx-auto max-w-7xl mr-0">
					<div className="flex h-12 items-center justify-between">
						<div className="hidden md:block">
							<div className="ml-4 flex items-center md:ml-6">
								{/* Profile dropdown */}
								<Menu as="div" className="relative ml-3">
									<div>
										<Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
											<span className="sr-only">Open user menu</span>
											<img className="h-8 w-8 rounded-full" src={user.avatar} alt="" />
										</Menu.Button>
									</div>
									<Transition
										as={Fragment}
										enter="transition ease-out duration-100"
										enterFrom="transform opacity-0 scale-95"
										enterTo="transform opacity-100 scale-100"
										leave="transition ease-in duration-75"
										leaveFrom="transform opacity-100 scale-100"
										leaveTo="transform opacity-0 scale-95"
									>
										<Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
											{userNavigation.map((item) => (
												<Menu.Item key={item.name}>
													{({ active }) => (
														<a
															href={item.href}
															className={classNames(
																active ? 'bg-gray-100' : '',
																'block px-4 py-2 text-sm text-gray-700'
															)}
															onClick={(e) => {
																	e.preventDefault();
																	if (item.onClick)
																		item.onClick(userActions)
																}
															}
														>
															{item.name}
														</a>
													)}
												</Menu.Item>
											))}
										</Menu.Items>
									</Transition>
								</Menu>
							</div>
						</div>

						<div className="flex md:hidden">
							{/* Mobile menu button */}
							<Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
								<span className="sr-only">Open main menu</span>
								{open ? (
									<XMarkIcon className="block h-6 w-6" aria-hidden="true" />
								) : (
									<Bars3Icon className="block h-6 w-6" aria-hidden="true" />
								)}
							</Disclosure.Button>
						</div>
					</div>
				</div>
				<Transition
					as={Fragment}
					enter="transition-all ease-out duration-100"
					enterFrom="opacity-40 scale-95"
					enterTo="opacity-100 scale-100"
					leave="transition-all ease-in duration-75"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-40 scale-95"
				>
					<Disclosure.Panel className="bg-gray-900 md:hidden absolute min-w-[200px] right-0 mt-12 origin-top-right rounded-md shadow-md shadow-neutral-800 rounded-t-none">
						<div className="pt-4 pb-3">
							<div className="flex items-center px-5">
								<div className="flex-shrink-0">
									<img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
								</div>
								<div className="ml-3">
									<div className="text-base font-medium leading-tight text-white">{user.name}</div>
									<div className="text-sm font-medium leading-tight text-gray-400">{"@" + user.userid}</div>
								</div>
							</div>
							<div className="mt-3 space-y-1 px-2">
								{userNavigation.map((item) => (
									<Disclosure.Button
										key={item.name}
										as="a"
										href={item.href}
										onClick= { () => {
												if (item.onClick)
													item.onClick(userActions)
											}
										}
										className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
									>
										{item.name}
									</Disclosure.Button>
								))}
							</div>
						</div>
					</Disclosure.Panel>
				</Transition>
			</>
		)
	}
}

/*
export function AccountIcon(userActions, open) {
	const { pathname } = useLocation();
	const { user } = userActions;
	if (!user) {
		console.error("AccountIcon created with no user...?");
	}

	
}*/