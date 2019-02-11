//
//  ViewController.swift
//  ATGoogleDriveDemo
//
//  Created by Dejan on 09/04/2018.
//  Copyright © 2018 Dejan. All rights reserved.
//

import UIKit
import GoogleSignIn
import GoogleAPIClientForREST
import GoogleToolboxForMac

class ViewController: UIViewController, UIImagePickerControllerDelegate, UINavigationControllerDelegate {

    @IBOutlet weak var signinButton: UIImageView!
    @IBOutlet weak var resultsLabel: UILabel!
    
    fileprivate let service = GTLRDriveService()
    private var drive: ATGoogleDrive?
    
    @IBOutlet var imageView: UIView!
    //@IBOutlet weak var imagePickerView: UIImageView!

    override func viewDidLoad() {
        super.viewDidLoad()
                        
        setupGoogleSignIn()
        
        drive = ATGoogleDrive(service)
        
        signinButton.addSubview(GIDSignInButton())
    }


    @IBAction func insertImage(_ sender: Any) {
        
        let imagePickerController = UIImagePickerController()
        imagePickerController.delegate = self
        
        let actionSheet = UIAlertController(title: "Photo Source", message: "Choose a Source", preferredStyle: .actionSheet)
        
        actionSheet.addAction(UIAlertAction(title: "Camera", style: .default, handler: { (action:UIAlertAction) in
            imagePickerController.sourceType = .camera
            self.present(imagePickerController, animated:true, completion: nil)
        }))
        
        actionSheet.addAction(UIAlertAction(title: "Photo Library", style: .default, handler: { (action:UIAlertAction) in
            imagePickerController.sourceType = .photoLibrary
            self.present(imagePickerController, animated:true, completion: nil)
        }))
        
        actionSheet.addAction(UIAlertAction(title: "Cancel", style: .default, handler: nil))
        
        self.present(actionSheet, animated: true, completion: nil)
    }
    
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : Any]) {
        if let editedImage = info[UIImagePickerControllerEditedImage] as? UIImage {
            // Use editedImage Here
            saveImage(image: editedImage)
            
        } else if let originalImage = info[UIImagePickerControllerOriginalImage] as? UIImage {
            // Use originalImage Here
            saveImage(image: originalImage)

        }
        picker.dismiss(animated: true)
    }
    
    func saveImage(image: UIImage) -> Bool {
        guard let data = UIImageJPEGRepresentation(image, 1) ?? UIImagePNGRepresentation(image) else {
            return false
        }
        let documentsDir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).last
        let testFilePath = documentsDir?.appendingPathComponent("logo.png").path
        let fileManager = FileManager.default
        fileManager.createFile(atPath: testFilePath!, contents: data, attributes: nil)
        uploadAction(path: testFilePath!)
        return true
    }
    
    func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
        picker.dismiss(animated: true, completion: nil)
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    private func setupGoogleSignIn() {
        GIDSignIn.sharedInstance().delegate = self
        GIDSignIn.sharedInstance().uiDelegate = self
        GIDSignIn.sharedInstance().scopes = [kGTLRAuthScopeDriveFile]
        GIDSignIn.sharedInstance().signInSilently()
    }
    
    
    func uploadAction(path: String) {
        
        //let testFilePath = documentsDir.appendingPathComponent("logo.png").path
        drive?.uploadFile("Notecaster", filePath: path, MIMEType: "image/png") { (fileID, error) in
            print("Upload file ID: \(fileID); Error: \(error?.localizedDescription)")
        }
    }
    
}

// MARK: - GIDSignInDelegate
extension ViewController: GIDSignInDelegate {
    func sign(_ signIn: GIDSignIn!, didSignInFor user: GIDGoogleUser!, withError error: Error!) {
        if let _ = error {
            service.authorizer = nil
        } else {
            service.authorizer = user.authentication.fetcherAuthorizer()
        }
    }
}

// MARK: - GIDSignInUIDelegate
extension ViewController: GIDSignInUIDelegate {}
