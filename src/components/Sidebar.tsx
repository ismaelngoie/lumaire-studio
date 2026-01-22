'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Store, HeartHandshake, CreditCard, Settings } from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Clients', icon: Users, href: '/clients' },
  { name: 'Vendors', icon: Store, href: '/vendors' },
  { name: 'Studio & Social', icon: HeartHandshake, href: '/marketing' },
  { name: 'Billing', icon: CreditCard, href: '/billing' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-lumaire-brown text-lumaire-ivory min-h-screen fixed left-0 top-0 p-8 flex flex-col justify-between z-50">
      <div>
        {/* Logo Area */}
        <div className="mb-16">
          <h1 className="font-script text-4xl text-lumaire-tan">Lumaire</h1>
          <p className="text-xs uppercase tracking-widest opacity-60 mt-2">Planner OS</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-4">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-4 p-3 rounded-sm transition-all duration-300 ${
                  isActive 
                    ? 'bg-lumaire-tan text-lumaire-brown font-medium shadow-md' 
                    : 'hover:bg-lumaire-white/5 opacity-80 hover:opacity-100'
                }`}
              >
                <item.icon size={20} />
                <span className="text-sm tracking-wide">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / User */}
      <div className="pt-8 border-t border-lumaire-ivory/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-lumaire-tan flex items-center justify-center text-lumaire-brown font-bold text-xs">
            IN
          </div>
          <div>
            <p className="text-sm font-medium">Ismael Ngoie</p>
            <p className="text-xs opacity-50">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
