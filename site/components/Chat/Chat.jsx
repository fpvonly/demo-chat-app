import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import chat from './chat_ws.js';
import ChatLogin from './ChatLogin.jsx';

export default class Chat extends React.Component {

  constructor(props) {
    super(props);

    this.form = null;
    this.chat_funcs_area = null;

    this.state = {
      ONLINE: false
    }
  }



  componentWillMount() {

  }
  componentDidMount() {
//TODO
    this.form.submit( function() { return false; } );

		let chat_funcs_area = this.form.find( '#chat_funcs' );

    if( typeof WebSocket != "undefined" )
		{
			if( this.getCookie( 'chat_name' ) == '' && this.getCookie( 'email' ) == '' )
			{
				this.setState({ONLINE: false});
			}
			else
			{
        this.setState({ONLINE: true});
        //TODO __>
				//chat_reg_area.hide();
				//chat_funcs_area.show();
			//	let msg_btn = this.form.find('#message_send_btn');
			//	msg_btn.click( function() { this.validateAndSendMessage( this.form ); });
			//	this.form.keyup( function(e) { if(e.keyCode == 13) { this.validateAndSendMessage( this.form ); }  } );
				this.openConnection();
			}
		}
  }

  openConnection = () => {
    if( typeof WebSocket != "undefined" ) {
       let host = window.location.host;
       if( host.indexOf('localhost') != -1 || host.indexOf('127.0.0.1') != -1 ) {
          this.ws = new WebSocket("ws://localhost:3000/echo");
       } else {
          this.ws = new WebSocket("ws://128.199.45.96:80/echo");
       }

       this.ws.onopen = () => {
         this.setState({ONLINE: true});
      };

       this.ws.onmessage = (evt) => {
        let received_msg = evt.data;
        let messages = this.form.find('#message_area').find('.message');
        let align_class = 'msg_right';
        if( messages.length > 0 )
        {
          if( messages.first().hasClass('msg_right') )
          {
            align_class = 'msg_left';
          }
        }
        this.form.find('#message_area').prepend( '<div class="message ' + align_class + '">'+received_msg+'</div>' );
        this.form.find('#message_area .message').css('opacity');	// this line is needed to get css animation working
        this.form.find('#message_area .message').css('opacity', '1');
        if( this.getCookie( 'utype' ) == '1' )
        {
           this.form.find('#message_area .message .message_delete_link').css('display','inline-block');
        }
       };

       this.ws.onclose = () => {
//TODO
      //  chat_funcs_area.hide();
       };

      this.ws.onerror = () => {
      //  chat_reg_area.hide();
      //  chat_funcs_area.hide();
        this.form.find('#message_area').append('<br />Sorry but there seems to be a problem with the chat server.');
      };
    }
    else
    {
       // The browser doesn't support WebSocket
    //  chat_reg_area.hide();
    //  chat_funcs_area.hide();
      this.form.find('#message_area').html('<div class="message" style="opacity:1;">Valitettavasti selaimesi ei tue HTML5:n Websocket API:a, jota tarvitaan chatin toimintaan. Selain kannattaa päivittää uudempaan.</div><div class="clear"></div>');
    }
  }

    sendMessage = ( msg ) => {
      this.ws.send(msg);
    }

   validateAndSendMessage = ( chat_form ) => {
     let msg_input = $.trim( this.form.find('#message_input').val() );
     if( msg_input != '' ) {
        console.log('validateAndSendMessage', msg_input);
       this.sendMessage( msg_input+';' + this.getCookie( 'chat_name' ) + ';' + this.getCookie( 'email' ) );
       this.form.find('#message_input').val('');
     }
   }

   setCookie( cname, cvalue, exdays )
   {
     let d = new Date();
     d.setTime( d.getTime() + ( exdays*24*60*60*1000 ) );
     let expires = "expires="+d.toUTCString();
     document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
   }

   getCookie( cname )
   {
     let name = cname + "=";
     let ca = document.cookie.split(';');
     for( let i=0; i<ca.length; i++ )
     {
       let c = ca[i];
       while ( c.charAt(0)==' ' ) c = c.substring(1);
       if( c.indexOf(name) == 0 ) return c.substring(name.length,c.length);
     }
     return "";
   }




  render() {
      let chatArea = this.state.ONLINE === true
      ? <div>
          <div ref={(c) => { this.chat_funcs_area = $(c); }} id="chat_funcs">
            <input type="text" name="message_input" id="message_input" maxlength="1000" placeholder="Message"/>
            <input type="button" value="Send" id="message_send_btn" onClick={this.validateAndSendMessage} />
          </div>
          <div id="message_area">
            <div className="clear"></div>
          </div>
        </div>
      : null;

    return <div id="chat_area">
    TODO
     <form ref={(c) => { this.form = $(c); }} id="chat_form" action="#" method="POST" enctype="application/x-www-form-urlencoded">
      <ChatLogin visible={!this.state.ONLINE} setCookie={this.setCookie} openConnection={this.openConnection} />
      {chatArea}

     </form>
    </div>

  }
}
