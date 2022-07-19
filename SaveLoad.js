"use strict";
//https://www.base64decode.org/
function deleteSaveData(){
    setCookie("gs", "", new Date(0).toUTCString());
    setCookie("opt", "", new Date(0).toUTCString());
    setCookie("inv", "", new Date(0).toUTCString());
}

function setCookie(key, value, expire){
	document.cookie = `${key}=${value};expires=${expire};SameSite=Strict;domain=${document.domain};path=/`;
}

function loadSample(index){
	deleteSaveData();
	cookiesEnabled=0;
	let url = window.location.origin + window.location.pathname + "?D=";
	
	switch(index){
		case 0:{
			url += "eyJ0IjoyNjAxOTgsInIiOnsiYSI6Mn0sIm1yIjp7Im0iOjI0OSwiYiI6NTU1LCJjIjo0MjV9LCJtdSI6eyJtIjp7ImhwIjozLCJkIjozLCJtcyI6MywiYXQiOjV9LCJJIjp7ImF0IjoyfSwiYiI6eyJocCI6MywiZCI6M30sImMiOnsiaHAiOjMsImQiOjN9fSwiZyI6WyJSYSIsIlJlIiwiSFAiLCJEIl0sImEiOnsiQW0iOnsiYyI6NDc0LCJtIjowfSwiQXQiOnsiYyI6NDksIm0iOjB9LCJBayI6eyJjIjoxLCJtIjowfSwiQTAiOnsiYyI6MiwibSI6MH19LCJ0bSI6eyJ0MCI6eyJhYiI6MX19LCJtIjp7Im1tIjoxfX0=";
			break;
		}
		case 1:{
			url += "eyJ0IjoyODQ5MzQsInIiOnsiYSI6MTQsImIiOjJ9LCJtciI6eyJtIjoyMjgsIkkiOjM2OSwiYiI6ODQxLCJjIjo0MTksImciOjUzLCJoIjo4MDAsInIiOjg2NywiYSI6OTExLCJlIjoxMDA1LCJmIjo3NTEsInciOjQyOX0sIm11Ijp7Im0iOnsiaHAiOjEyLCJkIjoxMiwibXMiOjgsImF0Ijo4fSwiSSI6eyJocCI6MTIsImQiOjEyLCJtcyI6OCwiYXQiOjh9LCJiIjp7ImhwIjoxMiwiZCI6MTAsIm1zIjo4LCJhdCI6OCwic3IiOjF9LCJjIjp7ImhwIjoxMCwiZCI6MTAsIm1zIjo4LCJhdCI6OCwiYWciOjF9LCJnIjp7ImhwIjoxMCwiZCI6MTAsIm1zIjo4LCJhdCI6OH0sImgiOnsiaHAiOjEwLCJkIjoxMCwibXMiOjgsImF0Ijo4fSwiciI6eyJocCI6MTAsImQiOjEwLCJtcyI6OCwiYXQiOjh9LCJhIjp7ImhwIjoxMCwiZCI6MTAsIm1zIjo2LCJhdCI6OH0sImUiOnsiaHAiOjEwLCJkIjoxMCwibXMiOjYsImF0Ijo2LCJzciI6NiwiYWciOjN9LCJmIjp7ImhwIjoxMCwiZCI6MTAsIm1zIjo2LCJhdCI6Nn0sInciOnsiaHAiOjEwLCJkIjoxMCwibXMiOjYsImF0Ijo2fX0sImciOlsiUmEiLCJSZSIsIkhQIiwiRCJdLCJhIjp7IkFtIjp7ImMiOjM0NCwibSI6MH0sIkF0Ijp7ImMiOjYzLCJtIjowfSwiQTAiOnsiYyI6MTEsIm0iOjB9LCJBMSI6eyJjIjoxLCJtIjowfX0sInRtIjp7InQwIjp7ImFiIjoxLCJwIjoyfSwidDEiOnsiYWIiOjEsInAiOjJ9fSwibSI6eyJtbSI6MiwidWwiOjYsIk1QIjoyfX0=";
			break;
		}
		case 2:{
			url += "eyJ0IjoyOTk1NDcsInIiOnsiYSI6NDgxMTI2LCJjIjoxOX0sIm1yIjp7Im0iOjk5LCJJIjo5OSwiYiI6ODUzLCJjIjoxODksImciOjAsImgiOjUwMSwiciI6MCwidiI6MjUwLCJhIjo2NzQsImUiOjkxNCwiZiI6MTI3LCJ3Ijo1NDF9LCJtdSI6eyJtIjp7ImhwIjoxMSwiZCI6MTEsIm1zIjo4LCJhdCI6OCwic3IiOjksImFnIjoxMH0sIkkiOnsiaHAiOjExLCJkIjoxMSwibXMiOjgsImF0Ijo4LCJzciI6OSwiYWciOjl9LCJiIjp7ImhwIjoxMSwiZCI6MTEsIm1zIjo4LCJhdCI6OCwic3IiOjksImFnIjo5LCJzZCI6MiwibXAiOjR9LCJjIjp7ImhwIjoxMSwiZCI6MTEsIm1zIjo4LCJhdCI6OCwic3IiOjksImFnIjo5LCJzZCI6MSwibXAiOjJ9LCJnIjp7ImhwIjoxMSwiZCI6MTEsIm1zIjo4LCJhdCI6OCwic3IiOjksImFnIjo5LCJtcCI6Mn0sImgiOnsiaHAiOjExLCJkIjoxMSwibXMiOjgsImF0Ijo4LCJzciI6OSwiYWciOjksIm1wIjoyfSwiciI6eyJocCI6MTEsImQiOjExLCJtcyI6OCwiYXQiOjgsInNyIjo5LCJhZyI6OSwibXAiOjJ9LCJ2Ijp7ImhwIjoxMSwiZCI6MTEsIm1zIjo4LCJhdCI6OCwic3IiOjksImFnIjo5LCJtcCI6M30sImEiOnsiaHAiOjExLCJkIjoxMSwibXMiOjgsImF0Ijo4LCJzciI6OSwiYWciOjksInNkIjo0LCJtcCI6Nn0sImUiOnsiaHAiOjExLCJkIjoxMSwibXMiOjgsImF0Ijo4LCJzciI6OSwiYWciOjksInNkIjoyLCJtcCI6Mn0sImYiOnsiaHAiOjExLCJkIjoxMSwibXMiOjgsImF0Ijo4LCJzciI6OSwiYWciOjksInNkIjo2LCJtcCI6N30sInciOnsiaHAiOjExLCJkIjoxMSwibXMiOjgsImF0Ijo4LCJzciI6OSwiYWciOjksIm1wIjoyfX0sImJyIjp7ImRlIjoxNTUsIkYiOjI0MywiUCI6MCwiVyI6MjUzLjA0Njg3NX0sImJ1Ijp7IlAiOnsidGMiOjEsImFjIjo0fX0sImciOlsiUmEiLCJSZSIsIkhQIiwiRCJdLCJhIjp7IkFtIjp7ImMiOjEzMDIzLCJtIjowfSwiQWIiOnsiYyI6MzM1LCJtIjowfSwiQXQiOnsiYyI6NDg2NTIsIm0iOjB9LCJBayI6eyJjIjo4NSwibSI6MX0sIkEwIjp7ImMiOjIzMCwibSI6MH0sIkExIjp7ImMiOjMzLCJtIjowfSwiQTIiOnsiYyI6NCwibSI6MH0sIkFsIjp7ImMiOjksIm0iOjB9fSwidG0iOnsidDAiOnsiYWIiOjEsInAiOjN9LCJ0MSI6eyJhYiI6MSwicCI6N30sInQyIjp7ImFiIjoxLCJwIjo0fX0sIm0iOnsibCI6MTAsIm1tIjozLCJ1bCI6MTEsImdzciI6MywiTVAiOjE3fX0=";
			return;
		}
		case 3:{
			return;
		}
		case 4:{
			return;
		}
		case 5:{
			return;
		}
		case 6:{
			return;
		}
		case 7:{
			url += "eyJ0IjoyNTk5MzMsInIiOnsiYSI6MTgwLCJiIjoyNzE5LCJjIjo0NjUsImQiOjMsImUiOjM1NSwiZiI6NjN9LCJtciI6eyJtIjoxMCwiSSI6NCwiYiI6MjU2LCJjIjoyMzAsImciOjI3LCJoIjo1NywiciI6MTc5LCJ2IjoxMywiYSI6MTA5LCJlIjoxNDIsImYiOjE1NCwidyI6NDV9LCJtdSI6eyJtIjp7ImhwIjo0NSwiZCI6NDUsIm1zIjo0MCwiYXQiOjQwLCJzciI6MjEsImFnIjoyMSwic2QiOjI1LCJtcCI6MjZ9LCJJIjp7ImhwIjo0NSwiZCI6NDUsIm1zIjo0MCwiYXQiOjQwLCJzciI6MjEsImFnIjoyMSwic2QiOjI2LCJtcCI6MjZ9LCJiIjp7ImhwIjo0NSwiZCI6NDUsIm1zIjo0MCwiYXQiOjQwLCJzciI6MjEsImFnIjoyMSwic2QiOjI1LCJtcCI6MjZ9LCJjIjp7ImhwIjo0NSwiZCI6NDUsIm1zIjo0MCwiYXQiOjQwLCJzciI6MjEsImFnIjoyMSwic2QiOjI3LCJtcCI6MjZ9LCJnIjp7ImhwIjo0MCwiZCI6NDAsIm1zIjozNiwiYXQiOjM2LCJzciI6MjEsImFnIjoyMSwic2QiOjI3LCJtcCI6MjZ9LCJoIjp7ImhwIjo0MCwiZCI6NDAsIm1zIjozNiwiYXQiOjM2LCJzciI6MjEsImFnIjoyMSwic2QiOjI2LCJtcCI6MjZ9LCJyIjp7ImhwIjo0MCwiZCI6NDAsIm1zIjozNiwiYXQiOjM2LCJzciI6MjEsImFnIjoyMSwic2QiOjI2LCJtcCI6MjZ9LCJ2Ijp7ImhwIjo0MCwiZCI6NDAsIm1zIjozNiwiYXQiOjM2LCJzciI6MjEsImFnIjoyMSwic2QiOjI2LCJtcCI6MjZ9LCJhIjp7ImhwIjo0MCwiZCI6NDAsIm1zIjozNiwiYXQiOjM2LCJzciI6MjEsImFnIjoyMSwic2QiOjI1LCJtcCI6MjZ9LCJlIjp7ImhwIjo0MCwiZCI6NDAsIm1zIjozNiwiYXQiOjM2LCJzciI6MjAsImFnIjoyMCwic2QiOjI1LCJtcCI6MjZ9LCJmIjp7ImhwIjo0MCwiZCI6NDAsIm1zIjozNiwiYXQiOjM2LCJzciI6MTgsImFnIjoyMCwic2QiOjI1LCJtcCI6MjZ9LCJ3Ijp7ImhwIjo0MCwiZCI6NDAsIm1zIjozNiwiYXQiOjM2LCJzciI6MTgsImFnIjoxOCwic2QiOjI1LCJtcCI6MjZ9fSwiYnIiOnsiZGUiOjEsIkYiOjAsIlAiOjAsIlciOjQzLjc1fSwiYnUiOnsiZGUiOnsiYXQiOjQsIm1zIjo0LCJhciI6NCwiYXAiOjQsIkFkIjo0LCJBYyI6NH0sIkYiOnsiYWciOjQsInNkIjo0LCJhciI6NCwiYXAiOjQsIkFkIjo0LCJBYyI6NH0sIlAiOnsidGMiOjQsImFjIjo0LCJhciI6NCwiYXAiOjQsIkFkIjo0LCJBYyI6NH0sIlciOnsiZCI6NSwiaHAiOjQsImFyIjo0LCJhcCI6NCwiQWQiOjQsIkFjIjo0fX0sImciOlsiUmEiLCJSZSIsIkhQIiwiRCJdLCJhIjp7IkFtIjp7ImMiOjExMzIzMzAsIm0iOjB9LCJBYiI6eyJjIjoxODY2LCJtIjowfSwiQXQiOnsiYyI6MTQ5NjMxLCJtIjowfSwiQWsiOnsiYyI6NTU0MCwibSI6MH0sIkFzIjp7ImMiOjE1ODUsIm0iOjB9LCJBcCI6eyJjIjozLCJtIjowfSwiQTAiOnsiYyI6MTM3NSwibSI6MH0sIkExIjp7ImMiOjUyLCJtIjowfSwiQTIiOnsiYyI6MywibSI6MH0sIkEzIjp7ImMiOjEsIm0iOjB9LCJBbCI6eyJjIjo3LCJtIjowfX0sInRtIjp7InQwIjp7ImFiIjoxLCJwIjo0fSwidDEiOnsiYWIiOjEsInAiOjN9LCJ0MiI6eyJhYiI6MSwicCI6MX0sInQzIjp7ImFiIjoxLCJwIjozfX0sIm0iOnsibCI6NCwibW0iOjUsInVsIjoxMSwiZ3NyIjo5LCJNUCI6OSwiYWwiOjMwMCwiUiI6OH0sImkiOlt7ImUiOjAsInIiOjEsInQiOiJzaGllbGQiLCJuIjoiYXNwaXMiLCJwIjo2LCJpIjoyLCJsIjpmYWxzZSwiYSI6W3sidCI6ImYiLCJlIjoiZ2FpbiIsInAiOjEyLCJyIjoiYSIsImkiOjR9XX0seyJlIjowLCJyIjowLCJ0Ijoid2VhcG9uIiwibiI6InN0aWNrIiwicCI6OCwiaSI6MywibCI6ZmFsc2UsImEiOltdfSx7ImUiOjAsInIiOjMsInQiOiJzaGllbGQiLCJuIjoidGFyZ2UiLCJwIjoxNiwiaSI6NSwibCI6ZmFsc2UsImEiOlt7InQiOiJjIiwiZSI6ImRpc2NvdW50IiwicCI6MjAsInIiOiJhIiwiaSI6Nn1dfSx7ImUiOjAsInIiOjAsInQiOiJ3ZWFwb24iLCJuIjoiY2x1YiIsInAiOjEyLCJpIjo0LCJsIjpmYWxzZSwiYSI6W119LHsiZSI6MCwiciI6MSwidCI6InNoaWVsZCIsIm4iOiJhc3BpcyIsInAiOjYsImkiOjIsImwiOmZhbHNlLCJhIjpbeyJ0IjoiQm9tYmVyIiwiZSI6ImhlYWx0aCIsInAiOjEuMiwiciI6Im0iLCJpIjoxfV19LHsiZSI6MCwiciI6MSwidCI6InNoaWVsZCIsIm4iOiJhc3BpcyIsInAiOjYsImkiOjIsImwiOmZhbHNlLCJhIjpbeyJ0IjoiYyIsImUiOiJnYWluIiwicCI6MTIsInIiOiJhIiwiaSI6NH1dfSx7ImUiOjAsInIiOjEsInQiOiJzaGllbGQiLCJuIjoiYXNwaXMiLCJwIjo2LCJpIjoyLCJsIjpmYWxzZSwiYSI6W3sidCI6IkNhdGFwdWx0IiwiZSI6ImhlYWx0aCIsInAiOjYsInIiOiJhIiwiaSI6Mn1dfSx7ImUiOjAsInIiOjEsInQiOiJ3ZWFwb24iLCJuIjoic3BlYXIiLCJwIjoxNiwiaSI6NSwibCI6ZmFsc2UsImEiOlt7InQiOiJCb3NzIiwiZSI6ImRhbWFnZSIsInAiOjE2LCJyIjoiYSIsImkiOjV9XX0seyJlIjowLCJyIjoxLCJ0Ijoid2VhcG9uIiwibiI6InN0YWZmIiwicCI6MTIsImkiOjQsImwiOmZhbHNlLCJhIjpbeyJ0IjoiQm9zcyIsImUiOiJkYW1hZ2UiLCJwIjoxNiwiciI6ImEiLCJpIjo1fV19LHsiZSI6MCwiciI6MiwidCI6IndlYXBvbiIsIm4iOiJkYWdnZXIiLCJwIjoxNiwiaSI6NSwibCI6ZmFsc2UsImEiOlt7InQiOiJJbnZhZGVycyIsImUiOiJhdHRhY2tSYW5nZSIsInAiOjEuMywiciI6Im0iLCJpIjoyfV19LHsiZSI6MCwiciI6MSwidCI6InNoaWVsZCIsIm4iOiJhc3BpcyIsInAiOjYsImkiOjIsImwiOmZhbHNlLCJhIjpbeyJ0IjoiQm9zcyIsImUiOiJoZWFsdGgiLCJwIjo4LCJyIjoiYSIsImkiOjN9XX0seyJlIjowLCJyIjowLCJ0Ijoid2VhcG9uIiwibiI6ImNsdWIiLCJwIjoxMiwiaSI6NCwiYSI6W119LHsiZSI6MCwiciI6MiwidCI6IndlYXBvbiIsIm4iOiJjbGF3cyIsInAiOjIwLCJpIjo2LCJhIjpbeyJ0IjoiR29sZW0iLCJlIjoiaGVhbHRoIiwicCI6MS42LCJyIjoibSIsImkiOjR9XX1dfQ==";
			break;
		}
		case 8:{
			url += "eyJ0IjoyNzIyNTgsInIiOnsiYSI6MjY3LCJjIjo2LCJlIjo3NDQzLCJmIjo3N30sIm1yIjp7Im0iOjE5LCJJIjoxOSwiYiI6NTE3LCJjIjowLCJhIjoyOTIsImUiOjMxMTYsImYiOjg1NywidyI6MzExNn0sIm11Ijp7Im0iOnsiaHAiOjUsImQiOjUsIm1zIjo1LCJhdCI6NSwic3IiOjUsImFnIjo1LCJzZCI6MywibXAiOjN9LCJJIjp7ImhwIjo1LCJkIjo1LCJtcyI6NSwiYXQiOjUsInNyIjo0LCJhZyI6NSwic2QiOjMsIm1wIjozfSwiYiI6eyJocCI6NSwiZCI6NSwibXMiOjUsImF0Ijo1LCJzciI6NCwiYWciOjQsInNkIjozLCJtcCI6M30sImMiOnsiaHAiOjUsImQiOjUsIm1zIjo1LCJhdCI6NSwic3IiOjQsImFnIjo0LCJzZCI6MywibXAiOjN9LCJnIjp7InNyIjo0LCJhZyI6NCwic2QiOjMsIm1wIjozfSwiaCI6eyJzciI6NCwiYWciOjQsInNkIjozLCJtcCI6M30sInIiOnsic3IiOjQsImFnIjo0LCJzZCI6MywibXAiOjN9LCJ2Ijp7InNyIjo0LCJhZyI6NCwic2QiOjMsIm1wIjozfSwiYSI6eyJocCI6NSwiZCI6NSwibXMiOjUsImF0Ijo1LCJzciI6NCwiYWciOjQsInNkIjozLCJtcCI6M30sImUiOnsiaHAiOjUsImQiOjUsIm1zIjo1LCJhdCI6NSwic3IiOjQsImFnIjo0LCJzZCI6MywibXAiOjN9LCJmIjp7ImhwIjo1LCJkIjo1LCJtcyI6NSwiYXQiOjUsInNyIjo0LCJhZyI6NCwic2QiOjMsIm1wIjozfSwidyI6eyJocCI6NSwiZCI6NSwibXMiOjUsImF0Ijo1LCJzciI6NCwiYWciOjQsInNkIjozLCJtcCI6M319LCJnIjpbIlJhIiwiUmUiLCJIUCIsIkQiXSwiYSI6eyJBbSI6eyJjIjoxMzM4Njk0LCJtIjowfSwiQTAiOnsiYyI6MTU4NiwibSI6MH0sIkF0Ijp7ImMiOjE0OTU1LCJtIjoxfSwiQTEiOnsiYyI6NTcsIm0iOjB9LCJBayI6eyJjIjo1MjUsIm0iOjF9LCJBMiI6eyJjIjo0LCJtIjowfSwiQWIiOnsiYyI6MjYzOSwibSI6MH0sIkEzIjp7ImMiOjIsIm0iOjB9LCJBcyI6eyJjIjoyMDY3LCJtIjowfSwiQWwiOnsiYyI6OSwibSI6MH0sIkFwIjp7ImMiOjcsIm0iOjB9fSwidG0iOnsidDAiOnsiYWIiOjF9LCJ0MSI6eyJhYiI6MSwicCI6Mn0sInQyIjp7ImFiIjoxfSwidDMiOnsiYWIiOjEsInAiOjV9fSwibSI6eyJnc3IiOjMsIk1QIjo3LCJhbCI6NDAwLCJSIjoxMH0sImkiOlt7ImUiOjAsInIiOjIsInQiOiJzaGllbGQiLCJuIjoiYnVja2xlciIsInAiOjE2LCJpIjo0LCJsIjp0cnVlLCJhIjpbeyJ0IjoiSW52YWRlcnMiLCJlIjoiYXR0YWNrUmF0ZSIsInAiOjEuNiwiciI6Im0iLCJpIjozLCJhIjotNH1dfSx7ImUiOjAsInIiOjMsInQiOiJ3ZWFwb24iLCJuIjoiYXhlIiwicCI6MjAsImkiOjYsImwiOnRydWUsImEiOlt7InQiOiJJbnZhZGVycyIsImUiOiJkYW1hZ2UiLCJwIjoxLjIsInIiOiJtIiwiaSI6MSwiYSI6LTN9XX0seyJlIjowLCJyIjozLCJ0Ijoid2VhcG9uIiwibiI6ImthbWEiLCJwIjoyNCwiaSI6NywibCI6ZmFsc2UsImEiOlt7InQiOiJlIiwiZSI6ImRpc2NvdW50IiwicCI6MzAsInIiOiJhIiwiaSI6OCwiYSI6NH1dfSx7ImUiOjAsInIiOjMsInQiOiJzaGllbGQiLCJuIjoidGFyZ2UiLCJwIjoxNiwiaSI6NSwibCI6dHJ1ZSwiYSI6W3sidCI6IkludmFkZXJzIiwiZSI6ImRhbWFnZSIsInAiOjYsInIiOiJhIiwiaSI6MiwiYSI6LTF9XX0seyJlIjoxLCJyIjozLCJ0Ijoic2hpZWxkIiwibiI6InRhcmdlIiwicCI6MTYsImkiOjUsImwiOnRydWUsImEiOlt7InQiOiJhIiwiZSI6ImdhaW4iLCJwIjo0MiwiciI6ImEiLCJpIjoxMCwiYSI6N31dfSx7ImUiOjAsInIiOjMsInQiOiJzaGllbGQiLCJuIjoidGFyZ2UiLCJwIjoxNiwiaSI6NSwibCI6dHJ1ZSwiYSI6W3sidCI6ImYiLCJlIjoiZGlzY291bnQiLCJwIjoyMCwiciI6ImEiLCJpIjo2LCJhIjozfV19LHsiZSI6MCwiciI6MywidCI6IndlYXBvbiIsIm4iOiJheGUiLCJwIjoyMCwiaSI6NiwibCI6ZmFsc2UsImEiOlt7InQiOiJCb3NzIiwiZSI6ImRhbWFnZSIsInAiOjI0LCJyIjoiYSIsImkiOjcsImEiOjN9XX0seyJlIjoxLCJyIjozLCJ0IjoidG9yc28iLCJuIjoidmVzdCIsInAiOjYsImkiOjIsImwiOmZhbHNlLCJhIjpbeyJ0IjoiSW52YWRlcnMiLCJlIjoiZGFtYWdlIiwicCI6MiwiciI6ImEiLCJpIjowLCJhIjotM31dfSx7ImUiOjEsInIiOjQsInQiOiJ3ZWFwb24iLCJuIjoibWFjZSIsInAiOjI0LCJpIjo3LCJsIjp0cnVlLCJhIjpbeyJ0IjoiSW52YWRlcnMiLCJlIjoiaGVhbHRoIiwicCI6MiwiciI6Im0iLCJpIjo1LCJhIjotM30seyJ0IjoiQm9zcyIsImUiOiJkYW1hZ2UiLCJwIjozMCwiciI6ImEiLCJpIjo4LCJhIjozfV19LHsiZSI6MCwiciI6MywidCI6InNoaWVsZCIsIm4iOiJ0YXJnZSIsInAiOjE2LCJpIjo1LCJsIjp0cnVlLCJhIjpbeyJ0IjoiQm9zcyIsImUiOiJoZWFsdGgiLCJwIjoxLjYsInIiOiJtIiwiaSI6NCwiYSI6MX1dfSx7ImUiOjAsInIiOjMsInQiOiJzaGllbGQiLCJuIjoidGFyZ2UiLCJwIjoxNiwiaSI6NSwibCI6ZmFsc2UsImEiOlt7InQiOiJkIiwiZSI6ImdhaW4iLCJwIjo0MiwiciI6ImEiLCJpIjoxMCwiYSI6N31dfSx7ImUiOjAsInIiOjMsInQiOiJ3ZWFwb24iLCJuIjoia2FtYSIsInAiOjI0LCJpIjo3LCJsIjpmYWxzZSwiYSI6W3sidCI6ImMiLCJlIjoiZGlzY291bnQiLCJwIjozMCwiciI6ImEiLCJpIjo4LCJhIjo0fV19LHsiZSI6MCwiciI6MywidCI6InNoaWVsZCIsIm4iOiJ0YXJnZSIsInAiOjE2LCJpIjo1LCJsIjp0cnVlLCJhIjpbeyJ0IjoiZiIsImUiOiJkaXNjb3VudCIsInAiOjIwLCJyIjoiYSIsImkiOjYsImEiOjN9XX0seyJlIjowLCJyIjozLCJ0Ijoid2VhcG9uIiwibiI6ImF4ZSIsInAiOjIwLCJpIjo2LCJsIjpmYWxzZSwiYSI6W3sidCI6ImQiLCJlIjoiZ2FpbiIsInAiOjU0LCJyIjoiYSIsImkiOjEyLCJhIjo4fV19LHsiZSI6MCwiciI6MywidCI6InNoaWVsZCIsIm4iOiJ0YXJnZSIsInAiOjE2LCJpIjo1LCJsIjpmYWxzZSwiYSI6W3sidCI6IkJvc3MiLCJlIjoiaGVhbHRoIiwicCI6MTYsInIiOiJhIiwiaSI6NSwiYSI6Mn1dfSx7ImUiOjAsInIiOjMsInQiOiJsZWdzIiwibiI6ImNoYXVzc2VzIiwicCI6MTIsImkiOjQsImwiOmZhbHNlLCJhIjpbeyJ0IjoiUmFtIiwiZSI6ImhlYWx0aCIsInAiOjYsInIiOiJhIiwiaSI6MiwiYSI6MH1dfSx7ImUiOjAsInIiOjEsInQiOiJzaGllbGQiLCJuIjoiYXNwaXMiLCJwIjo2LCJpIjoyLCJsIjpmYWxzZSwiYSI6W3sidCI6ImUiLCJlIjoiZ2FpbiIsInAiOjMwLCJyIjoiYSIsImkiOjgsImEiOjd9XX0seyJlIjowLCJyIjozLCJ0IjoidG9yc28iLCJuIjoidmVzdCIsInAiOjYsImkiOjIsImwiOmZhbHNlLCJhIjpbeyJ0IjoiQm9zcyIsImUiOiJhdXJhUmFuZ2UiLCJwIjo0LCJyIjoiYSIsImkiOjEsImEiOjB9XX0seyJlIjowLCJyIjozLCJ0IjoidG9yc28iLCJuIjoidmVzdCIsInAiOjYsImkiOjIsImEiOlt7InQiOiJCb3NzIiwiZSI6ImF1cmFSYW5nZSIsInAiOjQsInIiOiJhIiwiaSI6MSwiYSI6MH1dfV19";
			break;
		}
		case 9:{
			return;
		}
	}
	
	console.log(url);
	window.location.href = url;
}
function loadURL(){
	var url = new URL(window.location.href);
	var d = url.searchParams.get("D");
	if(d !== null){
		const gameState = atob(d);
		loadDataFromString(gameState);
		buildWorld();
		yesCookies();
		window.history.replaceState({}, document.title, url.origin+url.pathname);
	}
	
	return false;
}

function isEmpty(item){
	return Object.keys(item).length === 0;
}
function isObject(item) {
	return (item && typeof item === "object" && !Array.isArray(item));
}
function mergeDeep(target, ...sources) {
	if (!sources.length) return target;
	const source = sources.shift();
	
	if (!isObject(target) || !isObject(source)) {
		return mergeDeep(target, ...sources);
	}
	
	for (const key in source) {
		if (isObject(source[key])) {
			if (!target[key])
			{
				Object.assign(target, { [key]: {} });
			}
			mergeDeep(target[key], source[key]);
			} else {
			Object.assign(target, { [key]: source[key] });
		}
	}
	
	return mergeDeep(target, ...sources);
}
function cleanObject(expected, input){
	if (!isObject(expected) || !isObject(input)){return;}
	
	for(let key in input){
		if(!(key in expected)){
			console.warn(`Unexpected property '${key}' with value '${input[key]}' on ${input}.`);
			delete input[key];
		}
		else if(isObject(expected[key]) && isObject(input[key])){
			cleanObject(expected[key], input[key]);
		}
		
	}
}
function offlineGains(minutes){
	if(minutes == 0){return;}
	
	const hours = minutes / 60;
	const score = getAchievementScore()**.5;
	
	let gains = Math.floor(hours * score);
	
	const totalGains = {};
	for(let i=0;i<5;i++){
		if(!tierUnlocked(i)){ return; }
		
		switch(i){
			case 0:{
				resources.a.amt += gains;
				totalGains.a = gains;
				break;
			}
			case 1:{
				resources.b.amt += gains;
				totalGains.b = gains;
				break;
			}
			case 2:{
				resources.c.amt += gains;
				totalGains.c = gains;
				break;
			}
			case 3:{
				resources.d.amt += gains;
				totalGains.d = gains;
				break;
			}
			case 4:{
				resources.e.amt += gains;
				totalGains.e = gains;
				break;
			}
		}
		
		gains=gains>>10;
	}
	
	const text = "Offline Gains:"
	
	const ul = document.getElementById("gainsList");
	for(let g in totalGains){
		const text = `\n${resources[g].name}: ${totalGains[g]}${resources[g].symbol}`;
		createNewElement("li", "gains"+g, ul, [], text);
	}
	toggleUIElementByID("gainsModal", false);
}

const year = 525600;//minutes in 365 days.

function loadCookieData(){
	const saveData = getCookie("gs");
	if(saveData && saveData != null){
		//if save data exists don't ask again.
		yesCookies();
		toggleUIElementByID("introModal", true);
		loadDataFromString(atob(saveData));
	}
	
	const options = getCookie("opt");
	if(options && options !== null){
		loadDataFromString(atob(options));
	}
	
	const inventory = getCookie("inv");
	if(inventory && inventory != null){
		loadDataFromString(atob(inventory));
	}
}
function loadDataFromString(saveString){
	let saveData = {};
	try{
		saveData = JSON.parse(saveString);
	}
	catch{
		console.error(saveString, saveData);
		console.error("Error loading JSON");
		console.trace();
	}
	
	loadMinionResearch(saveData);
	loadMinionUpgrades(saveData);
	loadBossResearch(saveData);
	loadBossUpgrades(saveData);
	loadGauges(saveData);
	loadResources(saveData);
	loadTierMisc(saveData);
	loadAchievements(saveData);
	loadMisc(saveData);
	loadInventory(saveData);
	loadOptions(saveData);
	loadTime(saveData);
}
function loadTime(saveData){
	if(!saveData.hasOwnProperty("t")){return;}
	const now = getTimeSave();
	const t = saveData.t;
	
	let minutes = now - t;
	while(minutes < 0){ minutes += year; }
	minutes=Math.max(0,minutes-30);
	
	offlineGains(minutes);
}
function loadMinionResearch(saveData){
	if(!saveData.hasOwnProperty("mr")){return;}
	
	for(let m in saveData.mr){
		const minion = slMap.toLoad(m);
		if(!minionResearch.hasOwnProperty(minion)){ continue; }
		
		minionResearch[minion].isUnlocked = 1;
		minionResearch[minion].lastSpawn = saveData.mr[m];
		const e = document.getElementById("chkSpawn" + minion);
		if(e != null){
			e.checked = true;
		}
	}
}
function loadMinionUpgrades(saveData){
	if(!saveData.hasOwnProperty("mu")){return;}
	
	for(let m in saveData.mu){
		const minion = slMap.toLoad(m);
		if(!minionUpgrades.hasOwnProperty(minion)){ continue; }
		
		for(let u in saveData.mu[m]){
			const upgrade = slMap.toLoad(u);
			if(!minionUpgrades[minion].hasOwnProperty(upgrade)){continue;}
			
			minionUpgrades[minion][upgrade] = saveData.mu[m][u];
		}
	}
}
function loadBossResearch(saveData){
	if(!saveData.hasOwnProperty("br")){return;}
	
	for(let b in saveData.br){
		const boss = slMap.toLoad(b);
		if(!bossResearch.hasOwnProperty(boss)){ continue; }
		
		bossResearch[boss].isUnlocked = 1;
		bossResearch[boss].lastSpawn = saveData.br[b];
	}
}
function loadBossUpgrades(saveData){
	if(!saveData.hasOwnProperty("bu")){return;}
	
	for(let b in saveData.bu){
		const boss = slMap.toLoad(b);
		if(!bossUpgrades.hasOwnProperty(boss)){ continue; }
		
		for(let u in saveData.bu[b]){
			const upgrade = slMap.toLoad(u);
			if(!bossUpgrades[boss].hasOwnProperty(upgrade)){continue;}
			
			bossUpgrades[boss][upgrade] = saveData.bu[b][u];
		}
	}
}
function loadGauges(saveData){
	if(!saveData.hasOwnProperty("g")){return;}
	for(let g in saveData.g){
		const gauge = slMap.toLoad(saveData.g[g]);
		if(gauges.hasOwnProperty(gauge)){
			gauges[gauge].isUnlocked = 1;
		}
	}
}
function loadResources(saveData){
	if(!saveData.hasOwnProperty("r")){return;}
	
	for(let r in saveData.r){
		if(!resources.hasOwnProperty(r)){ continue; }
		
		resources[r].amt = saveData.r[r];
	}
}
function loadTierMisc(saveData){
	if(!saveData.hasOwnProperty("tm")){return;}
	const tm = saveData.tm;
	
	for(let t in tm){
		if(tm[t].hasOwnProperty("ab")){
			tierMisc[t].autobuy.isUnlocked = 1;
		}
		if(tm[t].hasOwnProperty("p")){
			tierMisc[t].upgradePotency = tm[t].p;
		}
	}
}
function loadAchievements(saveData){
	if(!saveData.hasOwnProperty("a")){return;}
	for(let a in saveData.a){
		const ach = slMap.toLoad(a);
		if(!achievements.hasOwnProperty(ach)){ continue; }
		
		//old save compatibility
		if(!saveData.a[a].hasOwnProperty("c")){
			achievements[ach].count = saveData.a[a]||0;
			continue;
		}
		
		achievements[ach].count = saveData.a[a].c||0;
		achievements[ach].maxCount = saveData.a[a].m||0;
	}
}
function loadMisc(saveData){
	if(!saveData.hasOwnProperty("m")){return;}
	const m = saveData.m;
	
	if(m.hasOwnProperty("l")){
		totalPaths = LevelToTotalPaths(m.l);
		level = m.l;
	}
	if(m.hasOwnProperty("mm")){
		maxMinions = m.mm;
	}
	if(m.hasOwnProperty("ul")){
		maxUpgradeLevel = m.ul;
	}
	if(m.hasOwnProperty("gsr")){
		globalSpawnDelayReduction = m.gsr;
	}
	if(m.hasOwnProperty("MP")){
		moneyPitLevel = m.MP;
	}
	if(m.hasOwnProperty("al")){
		maxAutosellLimit = m.al;
		getUIElement("autoSellLimit").max=maxAutosellLimit;
		setElementTextById("maxAutosell", maxAutosellLimit);
	}
	if(m.hasOwnProperty("af")){
		maxAutoForgeLimit = m.af;
		getUIElement("autoForgeLimit").max=maxAutoForgeLimit;
		setElementTextById("maxAutoForge", maxAutoForgeLimit);
	}
	if(m.hasOwnProperty("R")){
		maxResetLevel = m.R;
		getUIElement("startingLevelSelector").max=m.R;
	}
}
function loadInventory(saveData){
	if(!saveData.hasOwnProperty("i")){return;}
	inventory.length=0;
	const inv = saveData.i;
	
	for(let i=0;i<inv.length;i++){
		loadItem(inv[i]);
	}
	setElementTextById("inventoryCount", inventory.length);
}
function loadOptions(saveData){
	if(!saveData.hasOwnProperty("o")){return;}
	const o = saveData.o;
	
	if(o.hasOwnProperty("fps")){
		document.getElementById("chkShowFPS").checked=o.fps;
	}
	if(o.hasOwnProperty("simple")){
		document.getElementById("chkSmipleMinions").checked=o.simple;
	}
	if(o.hasOwnProperty("compact")){
		document.getElementById("chkCompactMinions").checked=o.compact;
	}
	if(o.hasOwnProperty("autoSpawn")){
		document.getElementById("chkAutoSpawnMinions").checked=o.autoSpawn;
	}
	if(o.hasOwnProperty("p1Rate")){
		document.getElementById("ddlP1Rate").value=o.p1Rate;
	}
	if(o.hasOwnProperty("quality")){
		document.getElementById("ddlQuality").value=o.quality;
	}
	if(o.hasOwnProperty("style")){
		document.getElementById("ddlColors").value=o.style;
	}
	if(o.hasOwnProperty("blind")){
		document.getElementById("chkColorblind").checked=o.blind;
	}
	
	if(o.hasOwnProperty("boss")){
		document.querySelector("input[name='bossSelect'][value='"+o.boss+"']").checked = true;
	}
	if(o.hasOwnProperty("bPos")){
		document.getElementById("bossPosition").value=o.bPos;
	}
	
	if(o.hasOwnProperty("p0B")){
		document.getElementById("chkAutoBuy0").checked=o.p0B;
	}
	if(o.hasOwnProperty("p0P")){
		document.getElementById("chkAutoPrestige0").checked=o.p0P;
	}
	if(o.hasOwnProperty("p1B")){
		document.getElementById("chkAutoBuy1").checked=o.p1B;
	}
	if(o.hasOwnProperty("p1P")){
		document.getElementById("chkAutoPrestige1").checked=o.p1P;
	}
	if(o.hasOwnProperty("p2B")){
		document.getElementById("chkAutoBuy2").checked=o.p2B;
	}
	if(o.hasOwnProperty("p2P")){
		document.getElementById("chkAutoPrestige2").checked=o.p2P;
	}
	if(o.hasOwnProperty("p3B")){
		document.getElementById("chkAutoBuy3").checked=o.p3B;
	}
	if(o.hasOwnProperty("p3P")){
		document.getElementById("chkAutoPrestige3").checked=o.p3P;
	}
	
	if(o.hasOwnProperty("p4A")){
		document.getElementById("chkAutoSell").checked=o.p4A;
	}
	if(o.hasOwnProperty("p4L")){
		document.getElementById("autoSellLimit").value=o.p4L;
		autoSellLimit=+o.p4L;
		getUIElement("autoSellLimitSelection").textContent = autoSellLimit;
	}
	if(o.hasOwnProperty("p4F")){
		document.getElementById("chkAutoForge").checked=o.p4F;
	}
	if(o.hasOwnProperty("p4U")){
		document.getElementById("autoForgeLimit").value=o.p4U;
		autoSellLimit=+o.p4U;
		getUIElement("autoForgeLimitSelection").textContent = autoForgeLimit;
	}
	if(o.hasOwnProperty("p4S")){
		document.getElementById("startingLevelSelector").value=o.p4S;
		document.getElementById("startingLevelSelection").textContent=o.p4S;
		resetLevel = o.p4S;
	}
}

function saveData() {
	const d = new Date();
	d.setDate(d.getTime() + 7);
	
	const game = buildGameState(true, false, false);
	const inv = buildGameState(false, true, false);
	const opt = buildGameState(false, false, true);
	//const full = buildGameState(true, true, true);
	
	const saveGame = btoa(game);
	const saveInv = btoa(inv);
	const saveOpt = btoa(opt);
	//const saveFull = btoa(full);
	
	setCookie("gs", saveGame, d.toUTCString());
	setCookie("inv", saveInv, d.toUTCString());
	setCookie("opt", saveOpt, d.toUTCString());
	
	//console.log("save data:", saveFull.length, saveFull);
	lastSave = 0;
	
	document.getElementById("txtExport").value = null;
}
function buildGameState(game, inventory, options){
	const gameState = {
		t:getTimeSave()
	};
	
	if(game){
		const currentResources = getResourcesSave();
		if(!isEmpty(currentResources)){
			gameState.r = currentResources;
		}
		
		const minionResearchSave = getMinionResearchSave();
		if(!isEmpty(minionResearchSave)){
			gameState.mr = minionResearchSave;
		}
		
		const minionUpgradeSave = getMinionUpgradeSave();
		if(!isEmpty(minionUpgradeSave)){
			gameState.mu = minionUpgradeSave;
		}
		
		const bossResearchSave = getBossResearchSave();
		if(!isEmpty(bossResearchSave)){
			gameState.br = bossResearchSave;
		}
		
		const bossUpgradeSave = getBossUpgradeSave();
		if(!isEmpty(bossUpgradeSave)){
			gameState.bu = bossUpgradeSave;
		}
		
		const gaugesSave = getGaugesSave();
		if(!isEmpty(gaugesSave)){
			gameState.g = gaugesSave;
		}
		
		const achievementSave = getAchievementSave();
		if(!isEmpty(achievementSave)){
			gameState.a = achievementSave;
		}
		
		const tierMiscSave = getTierMiscSave();
		if(!isEmpty(tierMiscSave)){
			gameState.tm = tierMiscSave;
		}
		
		const miscSave = getMiscSave();
		if(!isEmpty(miscSave)){
			gameState.m = miscSave;
		}
	}
	
	if(inventory){
		const invSave = getInventorySave();
		if(!isEmpty(invSave)){
			gameState.i = invSave;
		}
	}
	
	if(options){
		const optSave = getOptionsSave();
		if(!isEmpty(optSave)){
			gameState.o = optSave;
		}
	}
	
	return JSON.stringify(gameState);
}
function getTimeSave(){
	return Math.floor(Date.now() / 60000) % year;
}
function getMinionResearchSave(){
	const unlocked = {};
	for(let minion in minionResearch){
		if(minionResearch[minion].isUnlocked){
			unlocked[slMap.toSave(minion)] = minionResearch[minion].lastSpawn;
		}
	}
	return unlocked;
}
function getMinionUpgradeSave(){
	const upgraded = {};
	
	for(let minion in minionUpgrades){
		for(let upgrade in minionUpgrades[minion]){
			if(minionUpgrades[minion][upgrade] > 0){
				const m = slMap.toSave(minion);
				if(!upgraded.hasOwnProperty(m)){
					upgraded[m] = {};
				}
				
				upgraded[m][slMap.toSave(upgrade)] = minionUpgrades[minion][upgrade];
			}
		}
	}
	return upgraded;
}
function getBossResearchSave(){
	const unlocked = {};
	for(let boss in bossResearch){
		if(bossResearch[boss].isUnlocked){
			unlocked[slMap.toSave(boss)] = bossResearch[boss].lastSpawn;
		}
	}
	return unlocked;
}
function getBossUpgradeSave(){
	const upgraded = {};
	
	for(let boss in bossUpgrades){
		for(let upgrade in bossUpgrades[boss]){
			if(bossUpgrades[boss][upgrade] > 0){
				const b = slMap.toSave(boss);
				if(!upgraded.hasOwnProperty(b)){
					upgraded[b] = {};
				}
				
				const a = slMap.toSave(upgrade);
				const x = bossUpgrades[boss][upgrade];
				
				upgraded[b][a] = x;
			}
		}
	}
	return upgraded;
}
function getGaugesSave(){
	const unlocked = [];
	for(let gauge in gauges){
		if(gauges[gauge].isUnlocked){
			unlocked.push(slMap.toSave(gauge));
		}
	}
	
	return unlocked;
}
function getResourcesSave(){
	const r = {};
	
	for(let resource in resources){
		if(resources[resource].amt > 0){
			r[resource] = resources[resource].amt
		}
	}
	
	return r;
}
function getTierMiscSave(){
	const r = {};
	
	for(let key in tierMisc){
		if(tierMisc[key].autobuy.isUnlocked){
			if(!r.hasOwnProperty(key)){
				r[key] = {};
			}
			r[key].ab = 1;
		}
		if(tierMisc[key].upgradePotency > 1){
			if(!r.hasOwnProperty(key)){
				r[key] = {};
			}
			r[key].p = tierMisc[key].upgradePotency;
		}
	}
	
	return r;
}
function getAchievementSave(){
	const counts = {};
	for(let a in achievements){
		if(achievements[a].count>0||achievements[a].maxCount>0){
			counts[slMap.toSave(a)] = {c:achievements[a].count,m:achievements[a].maxCount};
		}
	}
	return counts;
}
function getMiscSave(){
	const m = {};
	
	if(level > 0){
		m.l = level;
	}
	
	if(maxMinions > 0){
		m.mm = maxMinions;
	}
	
	if(maxUpgradeLevel > defaultMaxUpgradeLevel){
		m.ul = maxUpgradeLevel;
	}
	
	if(globalSpawnDelayReduction > 0){
		m.gsr = globalSpawnDelayReduction;
	}
	
	if(moneyPitLevel > 0){
		m.MP = moneyPitLevel;
	}
	
	if(maxAutosellLimit>100){
		m.al=maxAutosellLimit;
	}
	if(maxAutoForgeLimit>100){
		m.af=maxAutoForgeLimit;
	}
	if(maxResetLevel>0){
		m.R = maxResetLevel;
	}
	
	return m;
}
function getInventorySave(){
	const I = [];
	for(let i=0;i<inventory.length;i++){
		I.push(inventory[i].buildSave());
	}
	return I;
}
function getOptionsSave(){
	const o={};
	
	//save options tabs
	o.fps = document.getElementById("chkShowFPS")?.checked;
	o.simple = document.getElementById("chkSmipleMinions").checked;
	o.compact = document.getElementById("chkCompactMinions").checked;
	o.autoSpawn = document.getElementById("chkAutoSpawnMinions").checked;
	o.p1Rate = document.getElementById("ddlP1Rate").value;
	o.quality = document.getElementById("ddlQuality").value;
	o.style = document.getElementById("ddlColors").value;
	o.blind = document.getElementById("chkColorblind").checked;
	
	//save other tab options
	o.boss = document.querySelector("input[name='bossSelect']:checked")?.value;
	o.bPos = document.getElementById("bossPosition").value;
	
	o.p0B = document.getElementById("chkAutoBuy0").checked;
	o.p0P = document.getElementById("chkAutoPrestige0").checked;
	o.p1B = document.getElementById("chkAutoBuy1").checked;
	o.p1P = document.getElementById("chkAutoPrestige1").checked;
	o.p2B = document.getElementById("chkAutoBuy2").checked;
	o.p2P = document.getElementById("chkAutoPrestige2").checked;
	o.p3B = document.getElementById("chkAutoBuy3").checked;
	o.p3P = document.getElementById("chkAutoPrestige3").checked;
	
	o.p4A = document.getElementById("chkAutoSell").checked;
	o.p4L = document.getElementById("autoSellLimit").value;
	o.p4F = document.getElementById("chkAutoForge").checked;
	o.p4U = document.getElementById("autoForgeLimit").value;
	o.p4S = document.getElementById("startingLevelSelector").value;
	
	return o;
}

const saveLoadDictionary={
	a:"Air",
	Ab:"bossesSummoned",
	Ad:statTypes.abilityDuration,
	Ac:statTypes.abilityCooldown,
	Ak:"heroesKilled",
	Al:"maxLevelCleared",
	Am:"minionsSpawned",
	A0:"prestige0",
	A1:"prestige1",
	A2:"prestige2",
	A3:"prestige3",
	A4:"prestige4",
	Ap:"itemPrestiged",
	As:"itemScrapped",
	At:"towersDestroyed",
	al:"maxAutosellLimit",
	af:"maxAutoForgeLimit",
	ac:statTypes.attackCharges,
	ap:statTypes.auraPower,
	ar:statTypes.auraRange,
	at:statTypes.attackDelay,
	ag:statTypes.attackRange,
	b:"Bomber",
	c:"Catapult",
	cr:statTypes.chainReduction,
	de:"Death",
	d:statTypes.damage,
	D:"Damage",
	e:"Earth",
	f:"Fire",
	F:"Famine",
	g:"Golem",
	h:"Harpy",
	hp:statTypes.health,
	HP:"Health",
	i:statTypes.initialMinions,
	I:"Imp",
	l:"lastSpawn",
	m:"Mite",
	mp:statTypes.minionsPerDeploy,
	MP:"MoneyPitLevel",
	ms:statTypes.moveSpeed,
	P:"Pestilence",
	ps:statTypes.projectileSpeed,
	pt:"projectileType",
	r:"Ram",
	R:"resetLevel",
	Ra:"Range",
	Re:"Reload",
	sd:statTypes.spawnDelay,
	sr:statTypes.impactRadius,
	tc:statTypes.targetCount,
	u:"isUnlocked",
	v:"Vampire",
	w:"Water",
	W:"War"
}
const slMap = new TwoWayMap(saveLoadDictionary)
function TwoWayMap(dictionary) {
	this.map = dictionary;
	this.reverseMap = {};
	for(let key in dictionary) {
		const value = dictionary[key];
		this.reverseMap[value] = key;
	}
}
TwoWayMap.prototype.toLoad = function(key){ return this.map[key]; };
TwoWayMap.prototype.toSave = function(key){ return this.reverseMap[key]; };

function getCookie(prefix) {
	const dc = document.cookie;
	
	prefix = prefix+"=";
	const begin = dc.indexOf(prefix);
	if(begin==-1){return null;}
	let end = dc.indexOf(";", begin);
	if(end == -1){end = dc.length;}
	
	const output = dc.substring(begin + prefix.length, end);
	return output;
}
function getExport(){
	saveData();
	
	const gameState = buildGameState(true, true);
	const base64 = btoa(gameState);
	
	const txtExport = document.getElementById("txtExport");
	txtExport.value = base64;
	
	document.getElementById("txtImport").value = null;
}
function doImport(){
	const txtImport = document.getElementById("txtImport");
	const base64 = txtImport.value;
	
	const gameState = atob(base64);
	loadDataFromString(gameState);
	buildWorld();
	
	txtImport.value = null;
	document.getElementById("txtExport").value = null;
}

