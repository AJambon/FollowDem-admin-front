import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { DeviceService } from '../../../devices/devices.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { routerTransition } from '../../../../router.animations';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import _ from 'lodash';
import { AnimalsService } from '../../animals.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
	selector: 'app-animal-device-form',
	templateUrl: './animal-device-form.component.html',
	styleUrls: [ './animal-device-form.component.scss' ],
	animations: [ routerTransition() ]
})
export class AnimalDeviceFormComponent implements OnInit {
	deviceForm: FormGroup;
	startDate: string;
	devices: any[];
	@Input() animal_devices: any[];
	device_cols = [ 'ref_device', 'date_start', 'date_end', 'comment' ];
	showDeviceForm: boolean = false;
	closedAlertDevice: boolean = false;
	alertMsg: string;
	addDeviceError: boolean = false;
	@Input() viewMode: boolean;
	@Output() added_device = new EventEmitter<any>();
	editDevice: boolean = false;
	deviceToEdit: any;
	id_animal: number;
	now: any;
	tmpId: number;

	constructor(
		private deviceService: DeviceService,
		private animalsService: AnimalsService,
		private route: ActivatedRoute,
		private dateParser: NgbDateParserFormatter,
		private fb: FormBuilder
	) {}

	ngOnInit() {
		this.tmpId = 0;
		this.id_animal = this.route.snapshot.params['id'];
		if (!this.animal_devices) this.animal_devices = [];
		this.now = this.dateParser.parse(moment().format('YYYY-MM-DD'));
		this.deviceForm = this.fb.group({
			device: [ null, Validators.required ],
			date_start: [ null, Validators.required ],
			date_end: [ { value: null, disabled: true } ],
			comment: [ null ]
		});

		this.deviceForm.controls['date_start'].statusChanges.subscribe(() => {
			if (this.deviceForm.controls['date_start'].value) {
				this.startDate = this.deviceForm.controls['date_start'].value;
				this.deviceForm.controls['date_end'].reset();
				this.deviceForm.controls['date_end'].clearValidators();
				this.deviceForm.controls['date_end'].enable();
			}
		});

		this.deviceService.get().then((devices) => {
			this.devices = devices;
		});
	}

	onAddDevice() {
		this.showDeviceForm = true;
	}

	onSaveDevice(deviceOnSave) {
	
		if (this.deviceForm.valid) {
			let id_cor_ad = null;
			if (this.deviceToEdit) { id_cor_ad = this.deviceToEdit.id_cor_ad; }
			this.animalsService
				.device_available(
					this.deviceForm.get('device').value.id_device,
					this.dateParser.format(deviceOnSave.date_start),
					this.dateParser.format(deviceOnSave.date_end),
					this.id_animal,
					id_cor_ad
				)
				.then(
					(devId) => {
						if (this.editDevice) {
							// find and update device
							const indexDevice = this.animal_devices.findIndex((device) => {
								return device.tmpId === this.deviceToEdit.tmpId;
							});
							this.deviceToEdit.date_start = this.dateParser.format(deviceOnSave.date_start);
							this.deviceToEdit.comment = deviceOnSave.comment;
							if (deviceOnSave.date_end) {
								this.deviceToEdit.date_end = this.dateParser.format(deviceOnSave.date_end);
							} else {
								this.deviceToEdit.date_end = null;
							}
							this.animal_devices[indexDevice] = this.deviceToEdit;
							// reset attributre form and init value
							this.deviceForm.reset();
							this.editDevice = false;
							this.showDeviceForm = false;
							this.deviceForm.controls['device'].enable();
							this.deviceForm.controls['date_end'].disable();
							this.deviceToEdit = null;
							this.closedAlertDevice = true;
							this.added_device.emit(this.animal_devices); // event update animal_device
						} else {
							// on add new device
							deviceOnSave.ref_device = deviceOnSave.device.ref_device;
							deviceOnSave.id_device = deviceOnSave.device.id_device;
							deviceOnSave.tmpId = this.tmpId++;
							deviceOnSave.date_start = this.dateParser.format(deviceOnSave.date_start);
							if (deviceOnSave.date_end)
								deviceOnSave.date_end = this.dateParser.format(deviceOnSave.date_end);
							delete deviceOnSave.device;
							this.animal_devices.push(deviceOnSave);
							// reset device form and init value
							this.deviceForm.reset();
							this.showDeviceForm = false;
							this.closedAlertDevice = true;
							this.deviceForm.controls['date_end'].disable();
							this.added_device.emit(this.animal_devices); // event new animal_device
						}
					},
					(error) => {
						this.addDeviceError = true;
						this.alertMsg = error.error;
						this.closedAlertDevice = false;
					}
				);
		}
	}

	onEditDevice(deviceToEdit: any) {
		this.editDevice = true;
		console.log('deviceToEdit', deviceToEdit);
		
		this.deviceToEdit = deviceToEdit;
		let indexDevice = this.devices.findIndex((device) => {
			return device.id_device == deviceToEdit.id_device;
		});
		this.deviceForm.patchValue({
			device: this.devices[indexDevice],
			date_start: this.dateParser.parse(deviceToEdit.date_start),
			date_end: this.dateParser.parse(deviceToEdit.date_end),
			comment: deviceToEdit.comment
		});
		this.deviceForm.controls['device'].disable();
		this.showDeviceForm = true;
	}

	onDeleteDevice(deviceToDelete: any) {
		console.log('deviceToDelete', deviceToDelete);

		this.animal_devices = _.remove(this.animal_devices, (device: any) => {
			return deviceToDelete.tmpId !== device.tmpId;
		});
		this.added_device.emit(this.animal_devices);
	}

	onCancelAddDevice() {
		this.deviceForm.reset();
		this.showDeviceForm = false;
		this.closedAlertDevice = true;
		this.editDevice = false;
		this.deviceForm.controls['date_end'].disable();
		this.deviceForm.controls['device'].enable();
		this.deviceToEdit = null;
	}
}
