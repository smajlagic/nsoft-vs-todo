<template>
	
    <form class="login" @submit.prevent="login" id="login">
        <img src="../assets/logo.png">
		
		<div class="input-field">
        	<input type="text" name="username" v-model="input.username" placeholder="Email" />
		</div>
		<div class="input-field password-field">
        	<input type="password" name="password" v-model="input.password" placeholder="Password" v-show="!showPass" v-on:keyup.enter="login()" />
			<input type="text" v-model="input.password" v-show="showPass" placeholder="Password" v-on:keyup.enter="login()" />
			<span v-on:click="showPass = !showPass" class="showpass" v-bind:class="{ active: showPass }">&#128065;</span>
		</div>
		<div class="login-actions">
			<fieldset>
				<input type="checkbox" name="remember" :remember_check="remember_check" v-model="remember_check" id="remember">
				<label for="remember"><span></span> Remember me</label>
			</fieldset>
			<router-link to="/Password">Forget your password?</router-link>
		</div>
        <button type="submit">Sign up</button>
		
		<div class="errors" v-if="errors.length">
			<p>Error(s):</p>
			<ul>
				<li v-for="error in errors">{{ error }}</li>
			</ul>
		</div>
		
    </form>
</template>

<script>
    export default {
		name: 'Login',
        data() {
            return {
				errors: [],
                input: {
                    username: "",
					password: "",
                },
				showPass: false,
				remember_check: ""
            }
		},
		computed: {
			local_user: function() {
                return localStorage.getItem('todo_user');
			},
			local_pass: function() {
                return localStorage.getItem('todo_pass');
			},
			remember: function() {
				if(localStorage.getItem('todo_user') && localStorage.getItem('todo_pass')) {
					this.remember_check = '1';
				} else {
					this.remember_check = '';
				}
			}
		},
		watch: {
			
			remember: function() {
				if(localStorage.getItem('todo_user') && localStorage.getItem('todo_pass')) {
					this.remember_check = '1';
				} else {
					this.remember_check = '';
				}
			}
		},
        methods: {
            login() {
				this.errors = [];
                if(this.input.username != "" && this.input.password != "") {
                    if(this.input.username == this.$parent.mockAccount.username && this.input.password == this.$parent.mockAccount.password) {
                        this.$emit("authenticated", true);
						this.$router.replace({ name: "secure" });

						if(this.remember_check) {
							localStorage.setItem('todo_pass', this.input.password);
						} else {
							localStorage.removeItem('todo_pass');
						}

						localStorage.setItem('todo_user', this.input.username);
					

                    } else {
						console.log("The username and / or password is incorrect");
						this.errors.push('Access denied.');
                    }
                } else {
					console.log("A username and password must be present");
					this.errors.push('Please fill all fields.');
                }
            }
        }
    }
</script>

<style scoped>
    #login {
        max-width: 370px;
        margin: auto;
        padding: 0px;
		position: absolute;
		top: 50%; 
		left: 50%;
		transform: translate(-50%,-50%);
		display: flex;
		flex-direction: column;
		width: calc(100% - 40px);
    }
	#login *::-webkit-input-placeholder { color: #C3BDA9; font-weight: 600; opacity: 1; }
	#login *::-moz-placeholder { color: #C3BDA9; font-weight: 600; opacity: 1; }
	#login *:-ms-input-placeholder { color: #C3BDA9; font-weight: 600; opacity: 1; }
	#login *:-moz-placeholder { color: #C3BDA9; font-weight: 600; opacity: 1; }
	#login img {
		display: block;
		height: auto;
		margin: 0px auto;
		margin-bottom: 57px;
		max-width: 175px;
		width: 100%;
	}

	#login .errors {
		padding: 1.05rem 1rem;
		background-color: #f44336; /* Red */
		color: white;
		line-height: 1.4em;
		margin-top: 30px;
		width: 100%;
		font-size: 12px;
		font-weight: 400;
		border-radius: 3px;
		position: relatoive;
		
	}


	#login .input-field {
		display: block; 
		margin-bottom: 22px;
		position: relative;
		width: 100%;
	}
	#login .input-field.password-field {
		margin-bottom: 0px;
	}

	#login .input-field.password-field .showpass {
		position: absolute;
		right: 15px;
		top: 18px;
		user-select: none; /* supported by Chrome and Opera */
		-webkit-user-select: none; /* Safari */
		-khtml-user-select: none; /* Konqueror HTML */
		-moz-user-select: none; /* Firefox */
		-ms-user-select: none;
		opacity: 0.2;
		transition: opacity .25s ease-in-out;
	}
	#login .input-field.password-field .showpass.active {
		opacity: 0.8;
	}

	#login .input-field input[type=email],
	#login .input-field input[type=text],
	#login .input-field input[type=password] {
		border: 1px solid #EDEAE1;
		border-radius: 3px;
		box-shadow: #F9F8F5 0px 0px 1px 1px;
		font-size: 13px;
		padding: 1.05rem 1rem;
		width: 100%;
		transition: border-color .25s ease-in-out;
		-webkit-appearance: none;
		outline: 0px none;
	}

	#login .input-field input[type=email]:focus,
	#login .input-field input[type=text]:focus,
	#login .input-field input[type=password]:focus {
		border-color: #ccc;
	}

	#login input[type="checkbox"] {
		position:  absolute; 
		top:  0px; 
		left: 0px; 
		height:  20px; 
		width:  20px; 
		opacity: 0;
		-webkit-appearance:  none;
		visibility: hidden;
		border: 0px none;
		outline: 0px none;
		display: none;
		margin: 0px;
		padding: 0px;
		box-shadow: none !important;
	}

	#login input[type="checkbox"] + label {
		display:  flex; 
		color: #cac5b3;
		position:  relative;
		font-size:  13px; 
		font-weight: 600;
		align-items:  center; 
		justify-content:  flex-start; 
		padding-top: 2px;
	}

	#login input[type="checkbox"] + label:before, 
	#login input[type="checkbox"] + label:after {
		pointer-events: none; 
		border: 0px none;
		box-shadow: none;
	}
	#login input[type="checkbox"] + label:before {
		display:  flex; 
		content: ' ';
		height:  13px; 
		width:  14px; 
		border:  0px solid #e7e4da;
		border-radius: 4px;
		box-shadow: #e7e4da 0px 0px 1px 1px;
		background:  #fff;
		margin-right:  7px; 
		margin-left: 1px;
		position: relative;
		top: -1.5px;
	}
	#login input[type="checkbox"] + label:after {
		position:  absolute; 
		top:  4px; 
		display:  flex; 
		content: ' '; 
		height:  5px; 
		width:  8px; 
		left:  3.5px; 
		border-bottom:  solid 2px #C3BDA9; 
		border-left:  solid 2px #C3BDA9; 
		background:  none; 
		transform: rotate(-45deg) scale(0);
		transition:  transform .1s ease, opacity .1s ease;
		transform-origin: center center; 
	}
	#login input[type="checkbox"]:checked + label:after {
		opacity:  1; 
		transform: rotate(-45deg) scale(.8);
	}

	#login button {
		background: #5437f2;
		border: 1px solid #5437f2;
		border-radius: 4px;
		box-shadow: 0px 10px 38px -10px #4d4bff;
		color: #fff;
		cursor: pointer;
		font-size: 11px;
		font-weight: 600;
		padding-bottom: 18px;
		padding-top: 19.5px;
		transition: background .25s ease-in-out;
	}
	#login button:hover {
		background:  #4d4bff;
	}

	#login .login-actions { 
		display: flex; 
		justify-content: space-between; 
		align-items:  center; 
		overflow: hidden;
		padding-bottom:  34px;
		padding-top:  16px;
		position: relative;
		width: 100%; 
	}
	

	#login .login-actions a { 
		color: #cac5b3;
		font-size: 13px;
		font-weight: 600;
		position: relative;
		top: 1px;
		text-decoration: none;
		border-bottom: 1px solid transparent;
		transition: border .25s ease-in-out;
	}
	#login .login-actions a:hover {
	 	border-bottom: 1px solid #cac5b3;
	}

	@media only screen and (max-width: 640px) {
		#login {
			max-width: inherit;
			margin: auto;
			padding: 0px;
			position: relative;
			padding-top: 128px;
			padding-bottom: 128px;
			top: 0px;
			left: 0px;
			transform: translate(0%,0%);
			display: flex;
			flex-direction: column;
			width: calc(100% - 40px);
		}
		
		#login img {
			margin-bottom: 36px;
			max-width: 133px;
		}

		#login .input-field {
			margin-bottom: 21px;
		}

		#login .input-field input[type=email],
		#login .input-field input[type=text],
		#login .input-field input[type=password] {
			border: 1px solid #e3dfd1;
			border-radius: 3px;
			box-shadow: none;
			font-size: 12px;
			padding: 13px 12px 14px 12px;
			
		}

		#login .input-field.password-field .showpass {
			right: 15px;
			top: 15px;
			font-size: 14px;
		}

		#login *::-webkit-input-placeholder { font-weight: 300; opacity: 1; }
		#login *::-moz-placeholder { font-weight: 300; opacity: 1; }
		#login *:-ms-input-placeholder { font-weight: 300; opacity: 1; }
		#login *:-moz-placeholder { font-weight: 300; opacity: 1; }

		#login input[type="checkbox"] + label {
			padding-top: 1px;
		}

		#login input[type="checkbox"] + label:before {
			height:  15px; 
			width:  15px; 
			margin-right:  7px; 
			margin-left: 1px;
			top: -1px;
		}
		#login input[type="checkbox"] + label:after {
			top:  4px; 
			height:  5px; 
			width:  8px; 
			left:  5px; 
		}

		#login button {
			border-radius: 4px;
			box-shadow: 0px 10px 38px -10px #4d4bff;
			font-size: 11px;
			font-weight: 600;
			padding-bottom: 14px;
			padding-top: 13.5px;
		}

		#login .login-actions { 
			padding-bottom:  47px;
			padding-top:  18px;
		}

	}
</style>