

import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams, useLocation } from "react-router-dom";

const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:5000/api";

async function apiFetch(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers: any = { "Content-Type": "application/json", ...(opts.headers || {}) };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  const text = await res.text().catch(() => "");
  const parse = () => { try { return JSON.parse(text) } catch { return null } };

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("token");
      alert("로그인이 필요합니다. 다시 로그인해주세요.");
      window.location.href = "/login";
    }
    const msg = parse()?.error || parse()?.message || text || `${res.status} ${res.statusText}`;
    throw new Error(msg);
  }
  if (!text) return null;
  return parse() ?? text;
}


const unwrap = <T,>(x: any): T => (x && typeof x === "object" && "data" in x ? x.data : x);


const api = {
  signup: (p: { username: string; email: string; password: string; phone?: string }) =>
    apiFetch("/auth/register", { method: "POST", body: JSON.stringify(p) }),
  login: (u: string, pw: string) =>
    apiFetch("/auth/login", { method: "POST", body: JSON.stringify({ username: u, password: pw }) }),

  me: () => apiFetch("/users/profile"),
  updateProfile: (p: any) => apiFetch("/users/profile", { method: "PUT", body: JSON.stringify(p) }),

  listFacilities: (q: Record<string, any> = {}) => {
    const s = new URLSearchParams(q).toString();
    return apiFetch(`/facilities/list${s ? `?${s}` : ""}`);
  },
  searchFacilities: (q: string) => apiFetch(`/facilities/search?q=${encodeURIComponent(q)}`),
  getFacility: (id: string | number) => apiFetch(`/facilities/${id}`),

  listReviewsByFacility: (facility_id: number, page = 1, per_page = 10) =>
    apiFetch(`/reviews?facility_id=${facility_id}&page=${page}&per_page=${per_page}`),
  createReview: (p: { facility_id: number; content: string; rating: number; photo_url?: string }) =>
    apiFetch("/reviews", { method: "POST", body: JSON.stringify(p) }),

  calcPayments: (facility_id: number, membership_months = 1) =>
    apiFetch("/payments/calculate", { method: "POST", body: JSON.stringify({ facility_id, membership_months }) }),
};


function Shell({ title, actions, children }: { title: string; actions?: React.ReactNode; children: React.ReactNode }) {
  const authed = !!localStorage.getItem("token");
  const nav = useNavigate();
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <>
      <div className="appbar">
        <div className="container row">
          <Link to="/" className="brand">
            <span className="brand-badge" />
            CareFinder
          </Link>
          <nav className="nav">
            <Link className="btn" to="/search">시설 검색</Link>
            <Link className="btn" to="/calculator">계산기</Link>
            <Link className="btn" to="/settings">설정</Link>
            {authed ? (
              <button
                className="btn btn-outline"
                onClick={() => {
                  localStorage.removeItem("token");
                  nav("/login");
                }}
              >
                로그아웃
              </button>
            ) : (
              <Link className="btn btn-outline" to="/login">로그인</Link>
            )}
          </nav>
        </div>
      </div>

      <div className={`container page ${isHome ? "page--home" : ""}`}>
        <div className="pagehead">
          {/* 홈은 히어로가 있으니까 페이지 타이틀 시각적 여백만 유지 */}
          <h1>{title}</h1>
          <div>{actions}</div>
        </div>
        {children}
      </div>
    </>
  );
}


function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="field fade-in">
      <label>{label}</label>
      {children}
    </div>
  );
}


function Card({ title, children, right }: { title?: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="card fade-in">
      {(title || right) && (
        <div className="pagehead" style={{ marginBottom: 8 }}>
          {title && <h3>{title}</h3>}
          <div>{right}</div>
        </div>
      )}
      {children}
    </div>
  );
}



/** 홈*/
function Home() {
  const [list, setList] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const r = unwrap<any>(await api.listFacilities({ per_page: 8 }));
        setList(r?.data || r || []);
      } catch {}
    })();
  }, []);

  const goSearch = (e?: any) => {
    if (e) e.preventDefault();
    navigate(`/search${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`);
  };

  return (
    <Shell title=" ">
      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">케어서비스 탐색</div>
        <h1 className="hero-title">
          필요한 <span>시설</span>을, <br /> 빠르고 가볍게 찾으세요
        </h1>
        <p className="hero-sub">
          가격, 위치, 후기까지 한 번에. 계산기와 후기작성은 화면 따라가면 OK.
        </p>

        <form className="searchbar" onSubmit={goSearch}>
          <span className="search-ico">🔎</span>
          <input
            className="search-input"
            placeholder="시설명 또는 주소로 검색"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="btn btn-primary search-btn" type="submit">
            검색
          </button>
        </form>

        <div className="quick-actions">
          <button className="iconbtn" onClick={() => navigate("/calculator")}>
            <div className="icon">🧮</div>
            <div className="label">월 차액 계산</div>
          </button>
          <button className="iconbtn" onClick={() => navigate("/search")}>
            <div className="icon">🏥</div>
            <div className="label">시설 둘러보기</div>
          </button>
          <button className="iconbtn" onClick={() => navigate("/settings")}>
            <div className="icon">⚙️</div>
            <div className="label">내 프로필</div>
          </button>
        </div>
      </section>

      {/* Featured grid */}
      <section className="container">
        <div className="section-head">
          <h2 className="section-title">추천 시설</h2>
          <Link className="btn" to="/search">모두 보기</Link>
        </div>

        {list.length === 0 ? (
          <div className="empty">표시할 시설이 없습니다.</div>
        ) : (
          <div className="feature-grid">
            {list.map((f: any) => (
              <Link
                key={f.facility_id}
                to={`/facility/${f.facility_id}`}
                className="feature-card"
              >
                <div className="feature-media">🏥</div>
                <div className="feature-body">
                  <div className="feature-top">
                    <h3 className="feature-name">{f.name}</h3>
                    <span className="price-chip">
                      {f.monthly_cost != null
                        ? `월 ${Number(f.monthly_cost).toLocaleString()}원`
                        : "가격 정보 없음"}
                    </span>
                  </div>
                  <div className="feature-meta">
                    <span className="addr">{f.address || "주소"}</span>
                    <span className="dot">•</span>
                    <span className="rating">
                      <span className="star">★</span> {f.grade ?? "-"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

    
    </Shell>
  );
}

/** 로그인 */
function Login() {
  const nav = useNavigate();
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: any) => {
    e.preventDefault();
    setErr(null);
    try {
      const r = await api.login(username, password);
      const t = r?.access_token || (unwrap<any>(r)?.access_token);
      if (!t) throw new Error("토큰 없음");
      localStorage.setItem("token", t);
      nav("/");
    } catch (e: any) {
      setErr(e?.message || "로그인 실패");
    }
  };

  return (
    <Shell title="로그인">
      <form onSubmit={submit} style={{ maxWidth: 420 }} className="fade-in">
        <Field label="사용자명">
          <input className="input" value={username} onChange={(e) => setU(e.target.value)} placeholder="demo" required />
        </Field>
        <Field label="비밀번호">
          <input className="input" type="password" value={password} onChange={(e) => setP(e.target.value)} required />
        </Field>
        {err && <div className="pill" style={{ borderColor: "#745050", color: "#ffb3b3" }}>⚠ {err}</div>}
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <button className="btn btn-primary" type="submit">로그인</button>
          <Link className="btn" to="/signup">회원가입</Link>
        </div>
      </form>
    </Shell>
  );
}

/** 회원가입 */
function Signup() {
  const nav = useNavigate();
  const [f, setF] = useState({ username: "", email: "", password: "", phone: "" });
  const [err, setErr] = useState<string | null>(null);
  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));

  const submit = async (e: any) => {
    e.preventDefault();
    setErr(null);
    try {
      await api.signup(f);
      nav("/login");
    } catch (e: any) {
      setErr(e?.message || "회원가입 실패");
    }
  };

  return (
    <Shell title="회원가입">
      <form onSubmit={submit} style={{ maxWidth: 520 }} className="fade-in">
        <Field label="사용자명"><input className="input" value={f.username} onChange={(e) => set("username", e.target.value)} required /></Field>
        <Field label="이메일"><input className="input" type="email" value={f.email} onChange={(e) => set("email", e.target.value)} required /></Field>
        <Field label="휴대폰"><input className="input" value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder="010-0000-0000" /></Field>
        <Field label="비밀번호"><input className="input" type="password" value={f.password} onChange={(e) => set("password", e.target.value)} required /></Field>
        {err && <div className="pill" style={{ borderColor: "#745050", color: "#ffb3b3" }}>⚠ {err}</div>}
        <button className="btn btn-primary" type="submit">가입하기</button>
      </form>
    </Shell>
  );
}

/** 검색 */
function Search() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setL] = useState(false);

  const go = async (e?: any) => {
    if (e) e.preventDefault();
    setL(true);
    try {
      const r = q.trim() ? await api.searchFacilities(q.trim()) : await api.listFacilities({ per_page: 20 });
      const arr = unwrap<any>(r)?.data || unwrap<any>(r) || [];
      setItems(arr);
    } finally { setL(false); }
  };

  useEffect(() => { go(); }, []);

  return (
    <Shell title="시설 검색" actions={<span className="kbd">⌘K</span>}>
      <form onSubmit={go} style={{ display: "flex", gap: 10, maxWidth: 720, marginBottom: 14 }}>
        <input className="input" placeholder="시설명 또는 주소" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn btn-primary" type="submit">검색</button>
      </form>
      {loading && <div className="muted">검색 중…</div>}
      {!loading && items.length === 0 && <div className="empty">검색 결과가 없습니다.</div>}

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))" }}>
        {items.map((f: any) => (
          <div key={f.facility_id} className="card item">
            <div className="thumb">🏥</div>
            <div className="meta">
              <Link to={`/facility/${f.facility_id}`}><strong>{f.name}</strong></Link>
              <div className="muted">{f.address || "주소"}</div>
              <div style={{ marginTop: 6 }} className="muted">
                등급 {f.grade ?? "-"} · 월 {f.monthly_cost ? Number(f.monthly_cost).toLocaleString() : "-"}원
              </div>
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}

/** 시설 상세  */
function FacilityDetail() {
  const { id } = useParams();
  const [data, setData] = useState<any | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setL] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const d = unwrap<any>(await api.getFacility(id!));
        setData(d?.data || d);
        const r = unwrap<any>(await api.listReviewsByFacility(Number(id)));
        setReviews(r?.data || r || []);
      } finally { setL(false); }
    })();
  }, [id]);

  if (loading) return <Shell title="시설 상세">로딩…</Shell>;
  if (!data) return <Shell title="시설 상세">존재하지 않는 시설입니다.</Shell>;

  return (
    <Shell title=" ">
      {/* Facility Hero */}
      <section className="facility-hero">
        <div className="facility-media">🏥</div>
        <div className="facility-meta">
          <div className="facility-top">
            <h1 className="facility-name">{data.name || "시설 상세"}</h1>
            <span className="price-chip">
              {data.monthly_cost != null ? `월 ${Number(data.monthly_cost).toLocaleString()}원` : "가격 정보 없음"}
            </span>
          </div>
          <div className="meta-list">
            <span className="addr">{data.address || "주소 정보 없음"}</span>
            <span className="dot">•</span>
            <span className="rating"><span className="star">★</span> {data.grade ?? "-"}</span>
            {data.capacity != null && (<><span className="dot">•</span><span>정원 {data.capacity}</span></>)}
          </div>

          <div className="hero-actions">
            <Link className="btn btn-primary" to="/calculator">월 차액 계산하기</Link>
            {data.phone && <a className="btn" href={`tel:${data.phone}`}>전화문의</a>}
            <a className="btn btn-outline" href="#reviews">후기 보기</a>
          </div>
        </div>
      </section>

      {/* Content grid */}
      <section className="container">
        <div className="facility-grid">
          {/* Left column */}
          <div className="facility-col">
            <Card title="개요">
              <div className="muted">
                기본 정보와 간단 소개 영역입니다. 실제 소개 텍스트가 있다면 여기에 표시하세요.
              </div>
              <div className="divider" />
              <ul className="kv">
                <li><b>연락처</b><span>{data.phone || "정보 없음"}</span></li>
                <li><b>주소</b><span>{data.address || "정보 없음"}</span></li>
                <li><b>등급</b><span>{data.grade ?? "-"}</span></li>
                <li><b>정원</b><span>{data.capacity ?? "-"}</span></li>
              </ul>
            </Card>

            <Card title="후기/평점" right={<a href="#write-review" className="btn btn-outline">후기 작성</a>}>
              <div id="reviews" />
              <div style={{ display: "grid", gap: 12 }}>
                {reviews.length === 0 && <div className="empty">아직 후기가 없습니다.</div>}
                {reviews.map((r: any) => (
                  <div key={r.review_id} className="review-item">
                    <div className="review-head">
                      <div className="avatar">👤</div>
                      <div className="who">
                        <div className="name">{r.user?.username || "익명"}</div>
                        <div className="when muted">{new Date(r.created_at || Date.now()).toLocaleDateString()}</div>
                      </div>
                      <div className="stars">{"★".repeat(r.rating || 0)}{"☆".repeat(5 - (r.rating || 0))}</div>
                    </div>
                    <div className="review-body">{r.content}</div>
                    {r.photo_url && <img alt="" src={r.photo_url} className="review-photo" />}
                    <div className="divider" />
                  </div>
                ))}
              </div>
              <ReviewForm facilityId={Number(id)} onCreated={(r: any) => setReviews((s) => [r, ...s])} />
            </Card>
          </div>

          {/* Right column */}
          <div className="facility-col">
            <Card title="위치">
              <div className="mapbox">🗺️</div>
              <div className="muted" style={{ marginTop: 6 }}>
                실제 지도 연동 시 이 영역을 교체하세요.
              </div>
            </Card>

            <Card title="요금 요약">
              <div className="pill badge">기본 요금</div>
              <div className="price-major">
                {data.monthly_cost != null ? `${Number(data.monthly_cost).toLocaleString()}원 / 월` : "가격 정보 없음"}
              </div>
              <div className="divider" />
              <div className="muted">상세 요금 정책은 시설 문의</div>
            </Card>
          </div>
        </div>
      </section>
    </Shell>
  );
}

/** 후기 작성 폼 */
function ReviewForm({ facilityId, onCreated }: { facilityId: number; onCreated: (r: any) => void }) {
  const nav = useNavigate();
  const [rating, setR] = useState(5);
  const [content, setC] = useState("");
  const [busy, setB] = useState(false);

  const submit = async (e: any) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) { alert("후기를 입력해주세요."); return; }
    if (rating < 1 || rating > 5) { alert("평점은 1~5 사이여야 합니다."); return; }

    setB(true);
    try {
      const t = localStorage.getItem("token");
      if (!t) { alert("로그인이 필요합니다."); nav("/login"); return; }
      const res = await api.createReview({ facility_id: facilityId, content: trimmed, rating });
      const created = unwrap<any>(res) || (res as any)?.data || res;
      setC(""); setR(5);
      onCreated(created);
      alert("등록되었습니다.");
    } catch (e: any) {
      alert("후기 등록 실패: " + (e?.message || "알 수 없는 오류"));
    } finally { setB(false); }
  };

  return (
    <form id="write-review" onSubmit={submit} className="review-form">
      <div className="rf-grid">
        <Field label="평점">
          <select className="select" value={String(rating)} onChange={(e) => setR(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((n) => (<option key={n} value={n}>{n}</option>))}
          </select>
        </Field>
        <Field label="후기">
          <textarea
            className="input"
            value={content}
            onChange={(e) => setC(e.target.value)}
            placeholder="시설 이용 경험을 공유해주세요."
          />
        </Field>
      </div>
      <button className="btn btn-primary" disabled={busy}>
        {busy ? "등록 중…" : "후기 등록"}
      </button>
    </form>
  );
}

/** 월 차액 계산기 */
function Calculator() {
  const [facilityId, setFacilityId] = useState<number | "">("");
  const [months, setMonths] = useState(1);
  const [result, setResult] = useState<any | null>(null);
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await api.listFacilities({ per_page: 50 });
        const arr = unwrap<any>(r)?.data || unwrap<any>(r) || [];
        const withPrice = arr.filter((f: any) => f.monthly_cost != null);
        setOptions(withPrice);
        if (withPrice[0]) setFacilityId(withPrice[0].facility_id);
      } finally { setLoading(false); }
    })();
  }, []);

  const onCalc = async () => {
    if (!facilityId) { alert("시설을 선택해주세요."); return; }
    if (months < 1) { alert("개월 수는 1 이상이어야 합니다."); return; }
    try {
      const r = await api.calcPayments(Number(facilityId), months);
      setResult(unwrap<any>(r));
    } catch (e: any) {
      alert("계산 실패: " + (e?.message || "알 수 없는 오류"));
      setResult(null);
    }
  };

  return (
    <Shell title="월 차액 계산기">
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <Card>
          {loading ? (
            <div className="muted">시설 불러오는 중…</div>
          ) : (
            <>
              <Field label="시설 선택">
                <select
                  className="select"
                  value={facilityId === "" ? "" : String(facilityId)}
                  onChange={(e) => setFacilityId(Number(e.target.value))}
                >
                  {options.map((f: any) => (
                    <option key={f.facility_id} value={f.facility_id}>
                      {f.name} (월 {f.monthly_cost ? Number(f.monthly_cost).toLocaleString() : "-"}원)
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="개월 수">
                <input
                  className="input"
                  type="number"
                  min={1}
                  max={24}
                  value={months}
                  onChange={(e) =>
                    setMonths(Math.max(1, Math.min(24, Number(e.target.value) || 1)))
                  }
                />
              </Field>

              <button className="btn btn-primary" onClick={onCalc}>계산하기</button>
              <div className="muted" style={{ marginTop: 8 }}>※ JWT 필요. 월비용이 없는 시설은 계산 불가</div>
            </>
          )}
        </Card>

        <Card title="결과">
          {!result && <div className="empty">결과 없음</div>}
          {result && (
            <div className="fade-in">
              <div className="pill" style={{ marginBottom: 10 }}>
                {result.facility_name} / {result.months}개월
              </div>
              <div>총액: {Number(result.total_amount).toLocaleString()}원</div>
              <div>평균 월: {Number(result.average_monthly_amount).toLocaleString()}원</div>
              <div className="divider" />
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {(result.monthly_payments || []).map((p: any) => (
                  <li key={p.month_index}>
                    {p.month_index}개월차: {Number(p.amount).toLocaleString()}원
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </div>
    </Shell>
  );
}

/** 설정 */
function Settings() {
  const [f, setF] = useState<any>({ username: "", email: "", phone: "" });
  const [loaded, setL] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = unwrap<any>(await api.me());
        setF({ username: r.username || "", email: r.email || "", phone: r.phone || "" });
      } catch { /* not authed or error */ }
      finally { setL(true); }
    })();
  }, []);

  const save = async () => {
    try {
      await api.updateProfile(f);
      setMsg("저장되었습니다");
    } catch (e: any) {
      setMsg("실패: " + (e?.message || "오류"));
    }
  };

  if (!loaded) return <Shell title="설정">로딩…</Shell>;

  return (
    <Shell title="프로필 설정">
      <Card>
        <Field label="사용자명"><input className="input" value={f.username} onChange={(e) => setF({ ...f, username: e.target.value })} /></Field>
        <Field label="이메일"><input className="input" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
        <Field label="휴대폰"><input className="input" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></Field>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button className="btn btn-primary" onClick={save}>저장</button>
          {msg && <span className="muted">{msg}</span>}
        </div>
      </Card>
    </Shell>
  );
}

/** 라우터 엔트리 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/search" element={<Search />}/>
        <Route path="/calculator" element={<Calculator />}/>
        <Route path="/settings" element={<Settings />}/>
        <Route path="/facility/:id" element={<FacilityDetail />}/>
      </Routes>
    </BrowserRouter>
  );
}




