/*
	Copyright: Ari Petäjäjärvi
	2015
*/
$.fn.chat = function() {											
	var chat_forms = this;		
	
	return chat_forms.each( function() {	
		
		var WebSocketObj = null;
		var chat_form = $( this );
		
		chat_form.submit( function() { return false; } );
		
		var reg_btn = chat_form.find( '#reg_btn' );
		var chat_name = chat_form.find( '#chat_name' );
		var email = chat_form.find( '#email' );
		
		var chat_reg_area = chat_form.find( '#chat_reg' );
		var chat_funcs_area = chat_form.find( '#chat_funcs' );
		
		if( typeof WebSocket != "undefined" )
		{
			if( getCookie( 'chat_name' ) == '' && getCookie( 'email' ) == '' )
			{			
				reg_btn.click( function() {
					chat_name.css({'border':'0'});
					email.css({'border':'0'});
					if( $.trim( chat_name.val() ) != '' && $.trim( email.val() ) != '' )
					{
						if( isValidEmailAddress( $.trim( email.val() ) ) == true )
						{
							setCookie( 'chat_name', $.trim( chat_name.val() ), 1 );
							setCookie( 'email', $.trim( email.val() ), 1 );
							
							chat_reg_area.hide();
							chat_funcs_area.show();
							var msg_btn = chat_form.find('#message_send_btn');
							msg_btn.click( function() { validateAndSendMessage( chat_form ); });
							chat_form.keyup( function(e) { if(e.keyCode == 13) { validateAndSendMessage( chat_form ); }  } );
							openConnection( chat_form );
						}
						else
						{
							email.css({'border':'1px solid red'});
						}
					}
					else
					{
						if( $.trim( chat_name.val() ) == '' )
						{
							chat_name.css({'border':'1px solid red'});
						}
						if( $.trim( email.val() ) == '' )
						{
							email.css({'border':'1px solid red'});
						}
					}
				} );
			}
			else
			{
				chat_reg_area.hide();
				chat_funcs_area.show();
				var msg_btn = chat_form.find('#message_send_btn');
				msg_btn.click( function() { validateAndSendMessage( chat_form ); });
				chat_form.keyup( function(e) { if(e.keyCode == 13) { validateAndSendMessage( chat_form ); }  } );
				openConnection( chat_form );
			}
		}
		else
		{
			chat_reg_area.hide();
			chat_funcs_area.hide();
			chat_form.find('#message_area').html('<div class="message" style="opacity:1;">Valitettavasti selaimesi ei tue HTML5:n Websocket API:a, jota tarvitaan chatin toimintaan. Selain kannattaa päivittää uudempaan.</div><div class="clear"></div>');
		}

		
		// functions
		
		function WebSocketConn( chat_form )
		{				
			if( typeof WebSocket != "undefined" )
			{
			   var ws = new WebSocket("ws://localhost:80/echo");
			   //var ws = new WebSocket("ws://128.199.45.96:80/echo");
				
			   ws.onopen = function()
			   {			
				  chat_form.find('#message_area').prepend('<div class="message msg_right" style="opacity:1;">Welcome. Logged in.</div>');
			   };
				
			   ws.onmessage = function( evt ) 
			   { 
				  var received_msg = evt.data;		
				  var messages = chat_form.find('#message_area').find('.message');
				  var align_class = 'msg_right';
				  if( messages.length > 0 ) 
				  {
					  if( messages.first().hasClass('msg_right') )
					  {
							align_class = 'msg_left';
					  }
				  }			
				  chat_form.find('#message_area').prepend( '<div class="message ' + align_class + '">'+received_msg+'</div>' );	
				  chat_form.find('#message_area .message').css('opacity');	// this line is needed to get css animation working	
				  chat_form.find('#message_area .message').css('opacity', '1');			  
			   };
				
			   ws.onclose = function()
			   { 
					chat_funcs_area.hide();
			   };
			   
			   this.sendMessage = function( msg ) {
				   ws.send(msg);
			  }
			  
			  ws.onerror = function()
			   {						 
				  chat_reg_area.hide();
				  chat_funcs_area.hide();
				  chat_form.find('#message_area').append('<br />Sorry but there seems to be a problem with the chat server.');
			   };
			}				
			else
			{
			   // The browser doesn't support WebSocket
			  chat_reg_area.hide();
			  chat_funcs_area.hide();
			  chat_form.find('#message_area').html('<div class="message" style="opacity:1;">Valitettavasti selaimesi ei tue HTML5:n Websocket API:a, jota tarvitaan chatin toimintaan. Selain kannattaa päivittää uudempaan.</div><div class="clear"></div>');
			}
			
		}
						
		 function openConnection( chat_form ) 
		 {				
			if( WebSocketObj == null ) {
				WebSocketObj = new WebSocketConn( chat_form );
				return WebSocketObj;
			}
			else 
			{			
				return WebSocketObj;
			}
		}							

		function validateAndSendMessage( chat_form )
		{
			var msg_input = $.trim( chat_form.find('#message_input').val() );
			if( msg_input != '' )
			{
				WebSocketObj.sendMessage( msg_input+';'+getCookie( 'chat_name' )+';'+getCookie( 'email' ) );
				chat_form.find('#message_input').val('');
			}
		}			

		function setCookie( cname, cvalue, exdays )
		{
			var d = new Date();
			d.setTime( d.getTime() + ( exdays*24*60*60*1000 ) );
			var expires = "expires="+d.toUTCString();
			document.cookie = cname + "=" + cvalue + "; " + expires;
		}

		function getCookie( cname ) 
		{
			var name = cname + "=";
			var ca = document.cookie.split(';');
			for( var i=0; i<ca.length; i++ )
			{
				var c = ca[i];
				while ( c.charAt(0)==' ' ) c = c.substring(1);
				if( c.indexOf(name) == 0 ) return c.substring(name.length,c.length);
			}
			return "";
		}
		
		function isValidEmailAddress( emailAddress ) {
			var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
			return pattern.test( emailAddress );
		};
		
	});
};