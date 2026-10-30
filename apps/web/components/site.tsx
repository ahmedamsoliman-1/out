import Link from "next/link";
import type { Event } from "@yella/types";

export function Header() { return <header className="shell"><nav className="nav"><Link href="/" className="logo">yella <em>out</em></Link><div className="navlinks"><Link href="/#tonight">Tonight</Link><Link href="/submit">Submit an event</Link><Link href="/admin">Editorial</Link></div></nav></header>; }
export function Footer() { return <footer className="shell footer"><span>© 2026 Yella Out</span><span>Dubai, well chosen.</span></footer>; }
export function EventCard({ event }: { event: Event }) { const time = new Intl.DateTimeFormat("en-AE", { weekday:"short", hour:"numeric", minute:"2-digit", timeZone:"Asia/Dubai" }).format(new Date(event.startAt)); return <Link className="card" href={`/events/${event.slug}`}><div className="cardimg" style={{backgroundImage:`url(${event.image.url})`}}><span className="tag">{event.price.label}</span></div><div className="cardbody"><div className="meta">{time} · {event.area}</div><h3>{event.title}</h3><p className="why"><b>Why go:</b> {event.whyGo}</p></div></Link>; }
