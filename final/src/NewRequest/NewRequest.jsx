import { useState, useEffect, useRef } from "react";
import "./NewRequest.css";
import BackButton from "../Functions/BackButton";

export default function NewRequest() {


	return (
		<div>
			<BackButton />
			<h1 id="newRequestTitle">New Request</h1>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}>
				<div id="newRequestColumnContainer"></div>
			</div>
			
		</div>
	);
}
