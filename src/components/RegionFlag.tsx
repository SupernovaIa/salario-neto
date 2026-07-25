/**
 * Inline SVG flags for the 15 common-regime autonomous communities.
 *
 * They are drawn as stylized 3:2 flags: stripes and fields are faithful, but
 * heraldic charges (castles, lions, crowns, coats of arms) are simplified
 * silhouettes — at the 22px size used in the selector the real heraldry would
 * be an illegible smudge. Colours are close approximations of the official
 * ones. Everything is inline so the app keeps zero image assets.
 */

const GOLD = "#fcdd09";
const RED = "#da121a";
const CARMINE = "#ad1519";
const GREEN = "#007a3d";
const BLUE = "#0072c6";
const DEEP_BLUE = "#0033a0";
const PURPLE = "#7c4199";
const WINE = "#7c2946";
const WHITE = "#fff";
const BLACK = "#111";

/** Senyera: nine equal horizontal bands, five gold and four red. */
function Senyera({ x = 0, width = 30 }: { x?: number; width?: number }) {
  const band = 20 / 9;
  return (
    <>
      <rect x={x} width={width} height="20" fill={GOLD} />
      {[1, 3, 5, 7].map((i) => (
        <rect key={i} x={x} y={i * band} width={width} height={band} fill={RED} />
      ))}
    </>
  );
}

interface ChargeProps {
  x: number;
  y: number;
  scale: number;
  fill: string;
}

/** Three-towered castle with a taller central tower, on a 10×8 grid. */
function Castle({ x, y, scale, fill }: ChargeProps) {
  return (
    <g fill={fill} transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect y="3.2" width="10" height="4.8" />
      <rect x="0.2" y="1" width="2.6" height="2.4" />
      <rect x="3.7" width="2.6" height="3.4" />
      <rect x="7.2" y="1" width="2.6" height="2.4" />
    </g>
  );
}

/** Crown: a band with three points, on a 2×2 grid. */
function Crown({ x, y, scale, fill }: ChargeProps) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${scale})`}
      fill={fill}
      d="M0 2V0.5l0.5 0.8L1 0.2l0.5 1.1L2 0.5V2z"
    />
  );
}

/** Rampant lion silhouette, on a 7×8 grid. */
function Lion({ x, y, scale, fill }: ChargeProps) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${scale})`}
      fill={fill}
      d="M0.4 8V6.4c0.7-0.3 1.1-0.9 1.3-1.8l0.4-2.2C2.3 1.2 3 0.5 4 0.5l1.1 0 -0.6 0.9 0.9 0.5 1.2-0.6 0.4 0.9-1.2 0.7-0.9 0.9 0.5 1.2 1.1 1V8h-1.4l-0.9-1.2-1.1 0.3L2.3 8z"
    />
  );
}

/** Unit five-pointed star centred on the origin, radius 1. */
const STAR_PATH =
  "M0-1L0.235-0.324 0.951-0.309 0.38 0.124 0.588 0.809 0 0.4-0.588 0.809-0.38 0.124-0.951-0.309-0.235-0.324z";

function Star({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return <path d={STAR_PATH} transform={`translate(${cx} ${cy}) scale(${r})`} />;
}

/** Flag artwork by community id, matching the ids in `REGIONS`. */
const FLAGS: Record<string, React.ReactNode> = {
  // The general reference is the state scale, so it gets the Spanish flag
  // (plain rojigualda, without the coat of arms).
  general: (
    <>
      <rect width="30" height="20" fill="#f1bf00" />
      <rect width="30" height="5" fill="#c60b1e" />
      <rect y="15" width="30" height="5" fill="#c60b1e" />
    </>
  ),

  andalucia: (
    <>
      <rect width="30" height="20" fill={WHITE} />
      <rect width="30" height="6.67" fill={GREEN} />
      <rect y="13.33" width="30" height="6.67" fill={GREEN} />
    </>
  ),

  // Senyera plus a stylized quartered shield of Aragón, which is what tells it
  // apart from Cataluña at this size.
  aragon: (
    <>
      <Senyera />
      <g transform="translate(4.5 4)">
        <path
          d="M0 0h7v4.5C7 9 5 11 3.5 12 2 11 0 9 0 4.5z"
          fill={WHITE}
          stroke={WHITE}
          strokeWidth="0.8"
        />
        <path d="M0 0h3.5v6H0z" fill={GOLD} />
        <path d="M3.5 0H7v6H3.5z" fill={RED} />
        <path d="M0 6h3.5v4.5C2.4 9.9 1 8.4 0 6z" fill={WHITE} />
        <path d="M3.5 6H7c-1 2.4-2.4 3.9-3.5 4.5z" fill={GOLD} />
        <path d="M4.6 6h0.8v4H4.6z" fill={RED} />
        <path d="M1.3 7.2h1.9v0.7H1.3z" fill={RED} />
        <path d="M2.1 6.5h0.7v2.2h-0.7z" fill={RED} />
      </g>
    </>
  ),

  asturias: (
    <>
      <rect width="30" height="20" fill={BLUE} />
      <path
        fill={GOLD}
        d="M13.6 3.2h2.8l0.5 5.1 4.9 0.5v2.6l-4.9 0.5-0.5 5.4h-2.8l-0.5-5.4-4.9-0.5V8.8l4.9-0.5z"
      />
    </>
  ),

  "illes-balears": (
    <>
      <Senyera />
      <rect width="11" height="10" fill={WINE} />
      <Castle x={2.6} y={4.6} scale={0.58} fill={WHITE} />
    </>
  ),

  canarias: (
    <>
      <rect width="10" height="20" fill={WHITE} />
      <rect x="10" width="10" height="20" fill={DEEP_BLUE} />
      <rect x="20" width="10" height="20" fill="#ffce00" />
    </>
  ),

  cantabria: (
    <>
      <rect width="30" height="20" fill={WHITE} />
      <rect y="10" width="30" height="10" fill={RED} />
    </>
  ),

  "castilla-la-mancha": (
    <>
      <rect width="30" height="20" fill={WHITE} />
      <rect width="15" height="20" fill={CARMINE} />
      <Castle x={4.5} y={6} scale={0.6} fill={GOLD} />
    </>
  ),

  "castilla-y-leon": (
    <>
      <rect width="30" height="20" fill={WHITE} />
      <rect width="15" height="10" fill={CARMINE} />
      <rect x="15" y="10" width="15" height="10" fill={CARMINE} />
      <Castle x={4.7} y={2.4} scale={0.56} fill={GOLD} />
      <Castle x={19.7} y={12.4} scale={0.56} fill={GOLD} />
      <Lion x={17.8} y={1.4} scale={0.85} fill={PURPLE} />
      <Lion x={2.8} y={11.4} scale={0.85} fill={PURPLE} />
    </>
  ),

  cataluna: <Senyera />,

  extremadura: (
    <>
      <rect width="30" height="20" fill={WHITE} />
      <rect width="30" height="6.67" fill={GREEN} />
      <rect y="13.33" width="30" height="6.67" fill={BLACK} />
    </>
  ),

  galicia: (
    <>
      <rect width="30" height="20" fill={WHITE} />
      <path fill={BLUE} d="M0 0h5.6l24.4 16.3V20h-5.6L0 3.7z" />
    </>
  ),

  "la-rioja": (
    <>
      <rect width="30" height="20" fill={RED} />
      <rect y="5" width="30" height="5" fill={WHITE} />
      <rect y="10" width="30" height="5" fill={GREEN} />
      <rect y="15" width="30" height="5" fill={GOLD} />
    </>
  ),

  madrid: (
    <>
      <rect width="30" height="20" fill={CARMINE} />
      <g fill={WHITE}>
        {[6.6, 11.4, 16.2, 21].map((cx) => (
          <Star key={cx} cx={cx} cy={7.4} r={2.1} />
        ))}
        {[9, 13.8, 18.6].map((cx) => (
          <Star key={cx} cx={cx} cy={13.4} r={2.1} />
        ))}
      </g>
    </>
  ),

  // Four castles at the hoist, seven crowns (4 over 3) toward the fly.
  murcia: (
    <>
      <rect width="30" height="20" fill={CARMINE} />
      {[
        [2.4, 2.2],
        [8.6, 2.2],
        [2.4, 7],
        [8.6, 7],
      ].map(([x, y]) => (
        <Castle key={`${x}-${y}`} x={x} y={y} scale={0.44} fill={GOLD} />
      ))}
      {[16.4, 19.4, 22.4, 25.4].map((x) => (
        <Crown key={x} x={x} y={10.4} scale={1.15} fill={GOLD} />
      ))}
      {[17.9, 20.9, 23.9].map((x) => (
        <Crown key={x} x={x} y={14.4} scale={1.15} fill={GOLD} />
      ))}
    </>
  ),

  "comunitat-valenciana": (
    <>
      <Senyera x={5} width={25} />
      <rect width="5" height="20" fill={DEEP_BLUE} />
      <Crown x={1.2} y={8.4} scale={1.3} fill={GOLD} />
    </>
  ),
};

interface Props {
  regionId: string;
  className?: string;
}

/**
 * Decorative flag for a community. Purely visual: the community name always
 * travels next to it, so the SVG is hidden from assistive tech.
 */
export function RegionFlag({ regionId, className = "flag" }: Props) {
  const artwork = FLAGS[regionId];
  // Unknown id: keep the slot so the labels next to it stay aligned.
  if (!artwork)
    return <span className={`${className} flag--placeholder`} aria-hidden="true" />;

  return (
    <svg className={className} viewBox="0 0 30 20" aria-hidden="true" focusable="false">
      {artwork}
    </svg>
  );
}
