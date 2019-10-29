<template>
    <form class="login" @submit.prevent="login" id="login">
        <img src="../assets/logo.png">
		<div class="input-field">
        	<input type="text" name="username" v-model="input.username" placeholder="Email" />
		</div>
		<div class="input-field password-field">
        	<input type="password" name="password" v-model="input.password" placeholder="Password" v-show="!showPass" v-on:keyup.enter="login()" />
			<input type="text" v-model="input.password" v-show="showPass" placeholder="Password" v-on:keyup.enter="login()" />
			<span v-on:click="showPass = !showPass" class="showpass" v-bind:class="{ active: showPass }">
				<i class="far fa-eye" v-if="!showPass"></i>
				<i class="far fa-eye-slash" v-else></i>
			</span>
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

<style lang="scss">
	@import "@/styles/views-login.scss";
</style>
