<?php
/**
 * This file is part of workerman.
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the MIT-LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @author teumessian<teumessian@qq.com>
 * @copyright teumessian<teumessian@qq.com>
 * @link http://www.teumessian.top/
 * @license http://www.opensource.org/licenses/mit-license.php MIT License
 */

/**
 * 主逻辑
 * 主要是处理 onMessage onClose 三个方法
 */

require_once 'Connection.php';

use \GatewayWorker\Lib\Gateway;

class Events
{
    /**
     * 当客户端连上时触发
     * @param int $client_id
     */
    public static function onConnect($client_id)
    {
        $_SESSION['id'] = time();
        Gateway::sendToCurrentClient('{"type":"welcome","id":'.$_SESSION['id'].'}');
    }
    
   /**
    * 有消息时
    * @param int $client_id
    * @param string $message
    */
   public static function onMessage($client_id, $message)
   {
        // 获取客户端请求
        $message_data = json_decode($message, true);
        if(!$message_data)
        {
            return ;
        }
        
        switch($message_data['type'])
        {
            case 'login':
                break;
            //获取排行榜
            case 'get':
                $db = new Workerman\MySQL\Connection('127.0.0.1', '3306', 'root', 'admin','webgame');
                $top_score = $db->query("select name, max(distance) from score group by name order by distance desc limit 5;");

                $new_message = array(
                    'type'=>'score', 
                    'id'  =>$_SESSION['id'],
                    'score'=>$top_score,
                );

                return Gateway::sendToClient($client_id, json_encode($new_message));
            //新增分数并转播
            case 'save':
                $db = new Workerman\MySQL\Connection('127.0.0.1', '3306', 'root', 'admin','webgame');
                $insert_id = $db->insert('score')->cols(array(
                    'name'=>$message_data["name"],
                    'distance'=>$message_data["distance"]+0))->query();
                $top_score = $db->query("select name, max(distance) from score group by name order by distance desc limit 5;");

                $new_message = array(
                    'type'=>'score', 
                    'id'  =>$_SESSION['id'],
                    'score'=>$top_score,
                );

                return Gateway::sendToAll(json_encode($new_message));
            // 更新用户
            case 'update':
                // 转播给所有用户
                Gateway::sendToAll(json_encode(
                    array(
                        'type'     => 'update',
                        'id'       => $_SESSION['id'],
                        'posX'        => $message_data["posX"]+0,
                        'posY'        => $message_data["posY"]+0,
                        'posZ'        => $message_data["posZ"]+0,
                        //'rotX'        => $message_data["rotX"]+0,
                        //'rotY'        => $message_data["rotY"]+0,
                        //'rotZ'        => $message_data["rotZ"]+0,
                        'targetY'        => $message_data["targetY"]+0,
                        'targetZ'        => $message_data["targetZ"]+0,
                        'distance'      => $message_data["distance"]+0,
                        'status'        => $message_data["status"],
                        'planeFallSpeed'     => $message_data["planeFallSpeed"],
                        'name'          => isset($message_data['name']) ? $message_data['name'] : 'Guest.'.$_SESSION['id'],
                        'authorized'    => false,
                        )
                    ));
                return;
            // 聊天
            case 'message':
                // 向大家说
                $new_message = array(
                    'type'=>'message', 
                    'id'  =>$_SESSION['id'],
                    'message'=>$message_data['message'],
                );
                return Gateway::sendToAll(json_encode($new_message));
        }
   }
   
   /**
    * 当用户断开连接时
    * @param integer $client_id 用户id
    */
   public static function onClose($client_id)
   {
       // 广播 xxx 退出了
       GateWay::sendToAll(json_encode(array('type'=>'closed', 'id'=>$_SESSION['id'],'client_id'=>$client_id)));
   }
}
