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
if(!function_exists('is_mobile'))
{
    function is_mobile()
    {
        //php判断客户端是否为手机
        $agent = $_SERVER['HTTP_USER_AGENT'];
        return (strpos($agent,"NetFront") || strpos($agent,"iPhone") || strpos($agent,"MIDP-2.0") || strpos($agent,"Opera Mini") || strpos($agent,"UCWEB") || strpos($agent,"Android") || strpos($agent,"Windows CE") || strpos($agent,"SymbianOS"));
    }
}
?>
<!doctype html>

<html>
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>The Wild Driving: The Game</title>
		<meta name="description" content="A game developed on a Basic 3D Scene with Three.js" />
		<meta name="keywords" content="three.js, webgl, game, 3d, animation, car, web development, javascript" />
		<meta name="author" content="Teumessian" />
		<link rel="shortcut icon" href="favicon.ico">
		<link href='https://fonts.googleapis.com/css?family=Playfair+Display:400,700,700italic' rel='stylesheet' type='text/css'>
		<link rel="stylesheet" type="text/css" href="css/demo.css" />
		<link rel="stylesheet" type="text/css" href="css/game.css" />
		<script type="text/javascript" src="js/lib/parseUri.js"></script> 
		<script type="text/javascript" src="js/lib/modernizr-1.5.min.js"></script>
		<script type="text/javascript" src="js/lib/Stats.js"></script>
		<script type="text/javascript" src="js/lib/TweenMax.min.js"></script>
		<script type="text/javascript" src="js/lib/three.min.js"></script>
		<script type="text/javascript" src="js/lib/jquery.min.js"></script>
		<script type="text/javascript" src="js/Plane.js"></script>
		<script type="text/javascript" src="js/Cloud.js"></script>
		<script type="text/javascript" src="js/Coin.js"></script>
		<script type="text/javascript" src="js/Ennemy.js"></script>
		<script type="text/javascript" src="js/Particle.js"></script>
		<script type="text/javascript" src="js/Sea.js"></script>
		<script type="text/javascript" src="js/Sky.js"></script>
		<script type="text/javascript" src="js/Model.js" /></script>
		<script type="text/javascript" src="js/Settings.js" /></script>
		<script type="text/javascript" src="js/Cookie.js" /></script>
		<script type="text/javascript" src="js/formControls.js" /></script>
		<script type="text/javascript" src="js/Keys.js" /></script>
		<script type="text/javascript" src="js/Message.js" /></script>
		<script type="text/javascript" src="js/WebSocketService.js" /></script>
		<script type="text/javascript" src="js/game.js" /></script>
		<!--[if IE]>
		  <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]-->
	</head>
	<body>
		<div class="game-holder" id="gameHolder">
			
			<div class="world" id="world" ></div>

			<div class="header" id="header">
				<h1><span>the</span>Wild Driving</h1>
				<h2>enjoy the open sky</h2>
				<div class="score" id="score">
					<div class="score__content" id="account">
						<div class="score__label" id="nameValue">user_default</div>
						<svg class="name-img" id="nameImg" viewbox="0 0 190 190">
							<image x="0" y="0" width="190" height="190" preserveAspectRatio="none meet" xlink:href="img/user_default.png" id="img"></image>
						</svg>
					</div>
					<div class="score__content" id="level">
						<div class="score__label">level</div>
						<div class="score__value score__value--level" id="levelValue">1</div>
						<svg class="level-circle" id="levelCircle" viewbox="0 0 200 200">
							<circle id="levelCircleBgr" r="80" cx="100" cy="100" fill="none" stroke="#b1bdfa" stroke-width="24px" />
							<circle id="levelCircleStroke" r="80" cx="100" cy="100" fill="none" #f25346 stroke="#4876FF" stroke-width="14px" stroke-dasharray="502" />
						</svg>
					</div>
					<div class="score__content" id="dist">
						<div class="score__label">distance</div>
						<div class="score__value score__value--dist" id="distValue">000</div>
					</div>
					<div class="score__content" id="energy">
						<div class="score__label">energy</div>
						<div class="score__value score__value--energy" id="energyValue">
							<div class="energy-bar" id="energyBar"></div>
						</div>
					</div>
				</div>

			</div>

			<div class="message message--replay" id="replayMessage">Click to Replay</div>
			<div class="message message--play" id="playMessage">Click to Play</div>
			<div class="message message--instructions" id="instructions">The mouse controls<span>Keyboard to chat</span></div>
		</div>
		
		<nav class="meta" id="meta" style="display: none;">
			<a><strong>History Score Rank</strong></a>
			<table class="meta__list" id="historyScoreList">
			</table>
			
			<a></a>

			<a><strong>Score Rank</strong></a>
			<table class="meta__list" id="scoreList">
			</table>
		</nav>

		<div class="chatUI">
			<input id="chat" type="text"></input>
			<div id="chatText"></div>
			<ul id="messageBox" class="message__box"></ul>
		</div>

		<div class="partisan" id="partisan">
			<svg class="partisan__bg" viewBox="0 0 500 188" preserveAspectRatio="none" width="100%" height="100%" aria-hidden="true">
				<polygon points="0 154 123.39 0 235.78 14.79 365.6 28.9 436.24 114.93 500 188 0 188 0 154" fill="#f7d9aa"/>
				<polygon points="0 188 108.84 18.17 347.91 26.79 500 188 365.6 28.9 123.39 0 0 154 0 188" fill="#e4e0ba"/>
			</svg>
			<h3 class="partisan__title">Teumessian</h3>
		</div>
	</body>
</html>
