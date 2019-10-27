<template>
	
    <div id="password">
        <img src="../assets/logo.png">
		
		<div class="input-field">
        	<p><i class="far fa-envelope"></i> <span>{{ local_user }}</span></p>
		</div>
        <div class="input-field">
        	<p><i class="fas fa-key"></i> <span>{{ local_password }}</span></p>
		</div>
		<div class="login-actions">
			<router-link to="/Login"><i class="far fa-hand-point-left"></i> Go back</router-link>
		</div>
    </div>
</template>

<script>
    export default {
        name: 'Password',
        computed: {
            local_user: function() {
                return this.$parent.mockAccount.username;
            },
            local_password: function() {
                return this.$parent.mockAccount.password;
            }
        },
    }
</script>

<style scoped>
    #password {
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
	#password img {
		display: block;
		height: auto;
		margin: 0px auto;
		margin-bottom: 57px;
		max-width: 175px;
		width: 100%;
	}
    

	#password .input-field {
		display: block; 
		margin-bottom: 0px;
		position: relative;
		width: 100%;
	}
	
	#password .input-field p {
        display: flex;
        flex-direction: column;
		font-size: 13px;
		padding: 1.05rem 1rem 0;
		width: 100%;
		text-align: center;
	}
    #password .input-field p i {
        color: #ccc;
        font-size: 24px;
        margin-bottom: 10px;
    }

	#password .login-actions { 
		display: flex; 
		justify-content: center; 
		align-items:  center; 
		overflow: hidden;
		padding-bottom:  34px;
		padding-top:  16px;
		position: relative;
		width: 100%; 
	}
	

	#password .login-actions a { 
		color: #cac5b3;
		font-size: 13px;
		font-weight: 600;
		position: relative;
		top: 1px;
		text-decoration: none;
		border-bottom: 1px solid transparent;
		transition: border .25s ease-in-out;
	}
	#password .login-actions a:hover {
	 	border-bottom: 1px solid #cac5b3;
	}

	@media only screen and (max-width: 640px) {
		#password {
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
		
		#password img {
			margin-bottom: 36px;
			max-width: 133px;
		}

		#password .input-field {
			margin-bottom: 21px;
		}

		#password .input-field p {
			font-size: 12px;
			padding: 13px 12px 14px 12px;
			
		}

		
		#password .login-actions { 
			padding-bottom:  47px;
			padding-top:  18px;
		}

	}

	
</style>