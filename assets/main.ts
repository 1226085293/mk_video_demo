import { _decorator, Component } from "cc";
import * as cc from "cc";
const { ccclass, property } = _decorator;

@ccclass("main")
export class main extends Component {
	@property({ type: cc.VideoPlayer })
	videoComp: cc.VideoPlayer = null;
	@property({ type: cc.Sprite })
	spriteComp: cc.Sprite = null;
	@property({ type: cc.Material })
	meshNode: cc.Material = null;
	/* --------------- paragraph --------------- */
	private _video: HTMLVideoElement;
	private _texture = new cc.Texture2D();
	private _canvas: HTMLCanvasElement;
	private _image = new cc.ImageAsset();
	/* ------------------------------- segmentation ------------------------------- */
	start() {
		this._video = <HTMLVideoElement>document.getElementsByClassName("cocosVideo")[0];
		this._canvas = document.createElement("canvas");
		this._texture.image = this._image;

		this.videoComp.node.once(cc.VideoPlayer.EventType.READY_TO_PLAY, () => {
			this._canvas.width = this._video.videoWidth;
			this._canvas.height = this._video.videoHeight;
			this.updateTexture();
		});
	}
	button_play() {
		this.videoComp.play();
	}
	update() {
		if (!this.videoComp.isPlaying) {
			return;
		}
		this.updateTexture();
	}
	updateTexture() {
		this._canvas
			.getContext("2d")
			.drawImage(this._video, 0, 0, this._canvas.width, this._canvas.height);

		let base64String = this._canvas.toDataURL("image/png");
		var img = new Image();
		img.src = base64String;

		var self = this;
		img.onload = function () {
			self._image.reset(img);

			let _texture = new cc.Texture2D();
			_texture.image = self._image;

			self.spriteComp.spriteFrame.texture = _texture;
			self.spriteComp.markForUpdateRenderData();

			self.meshNode.setProperty("mainTexture", _texture);
		};
	}
}
