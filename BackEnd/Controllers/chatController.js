const db = require("../config/db");
const { use } = require("../Routes/auth");

const chatHandler = {};

chatHandler.findConversation = (req, res, next) => {
    const participantsID = req.params.userID;
    const userID = req.user.id;
    const conversationID = Math.max(userID,participantsID).toString() +"_" +Math.min(userID,participantsID);

    const searchQuery = "SELECT conversationID FROM socialmedia.conversation_table where conversationID = ?;";

    db.query(searchQuery, [conversationID], (err, results) => {
        if(err){
            next(err);
        } else{
           res.status(200).json(results);
        }
        });

};

chatHandler.getConversations = (req, res, next) => {
    const userID = req.user.id;

    const searchQuery = `select convolist.userID,userName , profileImgId , lastUpdate
    from socialmedia.userinfo, socialmedia.userbios, (SELECT participant1 as userID, lastUpdate FROM socialmedia.conversation_table
        where participant2 = ${userID} 
        union
        SELECT participant2 as userID, lastUpdate FROM socialmedia.conversation_table
        where participant1 = ${userID} ) as convolist
    where userinfo.userID = userbios.userID and userinfo.userID = convolist.userID and userinfo.userID in 
    (SELECT participant1 as userID FROM socialmedia.conversation_table
        where participant2 = ${userID} 
        union
        SELECT participant2 as userID FROM socialmedia.conversation_table
        where participant1 = ${userID} );`

    db.query(searchQuery , (err, results) => {
        if(err){
            next(err);
        } else{
            res.status(200).json(results);
        }
    });
};

chatHandler.createConversation = (req,res, next) => {
    const userID = req.user.id;
    const participantsID = req.params.userID;

    const conversationID = Math.max(userID,participantsID).toString() +"_" +Math.min(userID,participantsID).toString();
    console.log(conversationID);
    const insertQuery = `insert into socialmedia.conversation_table(conversationID, participant1, participant2, lastUpdate)
    value(?,?,?,now());`

    db.query(insertQuery,[conversationID,userID,participantsID], (err, results) => {
        if(err){
            next(err);
        } else{
            const insertQueryMsgTable = `insert into socialmedia.message_table(messageFrom, messageTo, messageText, date_time, conversationID)
            values(?,?,"dont_show",now(),?);`
            db.query(insertQueryMsgTable,[userID,participantsID,conversationID],(errMsg,resultsMsg) => {
                if(errMsg){
                    next(errMsg);
                } else{
                    res.json({
                        msg: "convo is created ! ",
                      });
                }
            })
            
        }
    })

};


chatHandler.getMessages = (req, res, next) => {
    const userID = req.user.id;
    const participantsID = req.params.userID;

    const conversationID = Math.max(userID,participantsID).toString() +"_" +Math.min(userID,participantsID).toString();
    console.log(conversationID+" "+userID+" "+participantsID);
    const searcQuery = `(select messageID, messageFrom, senderImg, messageTo,userName, receiverImg, messageText, date_time, conversationID   
        from socialmedia.message_table ,(select userId, profileImgId as senderImg from socialmedia.userbios where userId = ${userID}) as sender,
        (select userinfo.userID as userID, userName ,profileImgId as receiverImg from socialmedia.userinfo, socialmedia.userbios where userinfo.userID = userbios.userId and userinfo.userID = ${participantsID}) as receiver
        where message_table.messageFrom = sender.userId and message_table.messageTo = receiver.userId and conversationID = ?)
        
    union 
    (select messageID, messageFrom, senderImg, messageTo,userName, receiverImg, messageText, date_time, conversationID   
        from socialmedia.message_table ,(select userId, profileImgId as senderImg from socialmedia.userbios where userId = ${participantsID}) as sender,
        (select userinfo.userID as userID, userName ,profileImgId as receiverImg from socialmedia.userinfo, socialmedia.userbios where userinfo.userID = userbios.userId and userinfo.userID = ${userID}) as receiver
        where message_table.messageFrom = sender.userId and message_table.messageTo = receiver.userId and conversationID = ?)
        
        order by messageID desc;`;

    db.query(searcQuery, [conversationID, conversationID], (err,results) => {
        if(err){
            console.log(err);
        } 
        // console.log(results);
        if(results){
            //req.json({message: "You havn't started chatting yet"})
            res.json(results);
        } else{
            res.json({message: "You havn't started chatting yet"})
        }
        
    })
    
}

module.exports = chatHandler;
