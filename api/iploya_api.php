<?php
exit;
	/*
	*	NOT READY YET
	*	iploya - application programming interface (api)
	*	author: Ludwig Oberheuser<oberheuser@gmail.com
	*	created: 19.06.2018
	*
	*
	
	namespace iploya;
	
	class iploya_api {
		
		const PHP_PLUGIN_PATHNAME = "php_plugins";
		const PHP_PLUGIN_CORENAME = "core.php";
		
		//$getAs: 0 = only plugin name, 1 = fullpath
		public function getPlugins($getAs = 0) {
			$a = scandir($this->getCurrentPath() . self::PHP_PLUGIN_PATHNAME);
			$plugins	= [];
			if (!is_array($a))
				return false;
			foreach ($a as $f) { 
				if ($f === self::PHP_PLUGIN_CORENAME)
					continue;
				if (is_file($this->getCurrentPath() . self::PHP_PLUGIN_PATHNAME . DIRECTORY_SEPARATOR . $f)) 
					if ($getAs === 1)
						$plugins[] = substr($f, 0, strrpos($f, '.'));
					else
						$plugins[] = $this->getCurrentPath() . self::PHP_PLUGIN_PATHNAME . DIRECTORY_SEPARATOR . $f;
			}			
			return $plugins;		
		}
		
		public function LoadPluginInfo() {
			return json_decode(file_get_contents($this->getCurrentPath() . self::PHP_PLUGIN_PATHNAME . DIRECTORY_SEPARATOR . '/pluginsinfo.js'));
		}
		
		private function getCurrentPath() {
			return realpath(dirname(__FILE__)).DIRECTORY_SEPARATOR;
		}
		
	}
	
	$a = new iploya_api();
	
	var_dump($a->LoadPluginInfo());
	*/
?>	