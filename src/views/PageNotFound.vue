<template>
	
    <div id="page404">
        <img src="../assets/logo.png">
		
		<div class="input-field">
            <p><i class="fas fa-exclamation-triangle"></i>Oops! Nothing to see here.</p>
		</div>
		<div class="login-actions">
			<router-link to="/Login"><i class="far fa-hand-point-left"></i> Go back</router-link>
		</div>
    </div>
</template>

<script>
    export default {
        name: 'Password',
    }
</script>

<style scoped>
    #page404 {
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
	#page404 img {
		display: block;
		height: auto;
		margin: 0px auto;
		margin-bottom: 57px;
		max-width: 175px;
		width: 100%;
	}
    

	#page404 .input-field {
		display: block; 
		margin-bottom: 0px;
		position: relative;
		width: 100%;
	}
	
	#page404 .input-field p {
        display: flex;
        flex-direction: column;
		font-size: 13px;
		padding: 1.05rem 1rem 0;
		width: 100%;
		text-align: center;
	}
    #page404 .input-field p i {
        color: #ccc;
        font-size: 48px;
        margin-bottom: 30px;
    }

	#page404 .login-actions { 
		display: flex; 
		justify-content: center; 
		align-items:  center; 
		overflow: hidden;
		padding-bottom:  34px;
		padding-top:  16px;
		position: relative;
		width: 100%; 
	}
	

	#page404 .login-actions a { 
		color: #cac5b3;
		font-size: 13px;
		font-weight: 600;
		position: relative;
		top: 1px;
		text-decoration: none;
		border-bottom: 1px solid transparent;
		transition: border .25s ease-in-out;
	}
	#page404 .login-actions a:hover {
	 	border-bottom: 1px solid #cac5b3;
	}

	@media only screen and (max-width: 640px) {
		#page404 {
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
		
		#page404 img {
			margin-bottom: 36px;
			max-width: 133px;
		}

		#page404 .input-field {
			margin-bottom: 21px;
		}

		#page404 .input-field p {
			font-size: 12px;
			padding: 13px 12px 14px 12px;
			
		}

		
		#page404 .login-actions { 
			padding-bottom:  47px;
			padding-top:  18px;
		}

	}

	
</style>