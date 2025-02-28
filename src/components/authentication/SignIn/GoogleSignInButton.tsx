import * as React from "react";

export interface GoogleSignInButtonProps {
	onClick?: () => void;
	disabled?: boolean;
}

export function GoogleSignInButton({
	onClick,
	disabled,
}: GoogleSignInButtonProps) {
	return (
		<button
			disabled={disabled}
			onClick={onClick}
			className="flex flex-col justify-center items-center px-16 py-3 mt-12 max-w-full text-lg font-medium tracking-tight leading-loose text-center border border-solid border-gray-500 border-opacity-30 rounded-[7992px] text-neutral-800 w-[448px] max-md:px-5 max-md:mt-10"
		>
			<div className="flex gap-3 max-w-full w-[184px]">
				<img
					loading="lazy"
					src="https://cdn.builder.io/api/v1/image/assets/TEMP/68bb20cf74712f98b1df853fff73989bc4afdc4fb7f0427971dd7204d211fcc1?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec"
					alt=""
					className="object-contain shrink-0 aspect-[0.72] w-[23px]"
				/>
				<div className="grow shrink my-auto w-[145px]">Sign in with Google</div>
			</div>
		</button>
	);
}
