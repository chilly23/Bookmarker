"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    fetchBookmarks();

    const channel = supabase
      .channel("realtime-bookmarks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        fetchBookmarks
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  async function fetchBookmarks() {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });
    setBookmarks(data || []);
  }

  async function signIn() {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function addBookmark(e) {
    e.preventDefault();
    if (!title || !url) return;

    await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: user.id,
    });

    setTitle("");
    setUrl("");
  }

  async function deleteBookmark(id) {
    await supabase.from("bookmarks").delete().eq("id", id);
  }

return (
  <>
    <div className="bg"></div>
    <div className="bg bg2"></div>
    <div className="bg bg3"></div>

    <div id="app-bg">
      <div className="overlay">
        {!user ? (
          <div className="glass">
            <h1>Smart Bookmarks</h1>
            <p className="muted">Save and sync your links in real time.</p>

            <button className="button" onClick={signIn}>
              <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262" className="svg">
                <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
                <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
              </svg>
              <span className="text">Continue with Google</span>
            </button>
          </div>
        ) : (
          <div className="glass">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h1>My Bookmarks</h1>
              <button className="delete" onClick={signOut}>Logout</button>
            </div>

            <form onSubmit={addBookmark} className="row">
              <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <input className="input" placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
              <button className="button" type="submit">
                <span className="text">Add</span>
              </button>
            </form>

            <div className="list">
              {bookmarks.map((b) => (
                <div key={b.id} className="item">
                  <a className="link" href={b.url} target="_blank">{b.title}</a>
                  <button className="delete" onClick={() => deleteBookmark(b.id)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </>
);}
