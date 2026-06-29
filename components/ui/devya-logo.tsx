interface Props {
  className?: string;
  withWordmark?: boolean;
  size?: number;
}

export function DevyaMark({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={(size * 32) / 30}
      viewBox="0 0 30 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Devya"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.74646 20.2808L11.5599 26.5381V21.6244L4.87239 17.7545L11.5609 13.8847V8.97095L0.74646 15.2274V20.2808Z"
        fill="currentColor"
      />
      <path
        d="M13.1077 25.1467V3.69162L15.6037 1.77749V23.704L13.1077 25.1467Z"
        stroke="currentColor"
        strokeWidth="1.75375"
      />
      <path
        d="M22.126 17.6124L28.3758 21.229V24.1165L19.3161 18.8739V14.832L28.3767 9.59017V12.4778L22.126 16.0944L20.8143 16.8534L22.126 17.6124Z"
        stroke="currentColor"
        strokeWidth="1.75375"
      />
      <path
        d="M18.44 14.4328L29.2534 20.6902L29.2534 25.7436L18.439 32L18.439 27.0863L25.1275 23.2164L18.44 19.3465L18.44 14.4328Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function DevyaLogo({ className, withWordmark = true, size = 28 }: Props) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ''}`}>
      <DevyaMark size={size} className="text-white" />
      {withWordmark && (
        <span className="font-sora font-semibold tracking-tight text-white text-[15px] leading-none">
          devya
        </span>
      )}
    </span>
  );
}
